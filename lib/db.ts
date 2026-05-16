/**
 * Database layer using sql.js (pure JS, no native compilation required).
 * Persistence: database file stored at process.cwd() + /data/pay.db
 * (on ECS: /var/www/baobaoxz-site/data/pay.db)
 */
import initSqlJs, { Database as SqlJsDatabase } from "sql.js";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";

export interface DbOrder {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

export interface DbMembership {
  user_id: string;
  plan_id: string;
  status: string;
  starts_at: string;
  expires_at: string;
  auto_renew: number;
  contract_id: string | null;
}

let _db: SqlJsDatabase | null = null;
let _initPromise: Promise<SqlJsDatabase> | null = null;

const DB_FILENAME = "pay.db";
const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, DB_FILENAME);

function getDbPath(): string {
  // Allow override via env (useful for different deployment paths)
  return process.env.DB_PATH || DB_PATH;
}

async function initDb(): Promise<SqlJsDatabase> {
  const dbPath = getDbPath();

  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  });

  let db: SqlJsDatabase;
  if (existsSync(dbPath)) {
    const buf = readFileSync(dbPath);
    db = new SQL.Database(buf);
  } else {
    db = new SQL.Database();
    // Ensure data directory exists
    mkdirSync(DATA_DIR, { recursive: true });
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      paid_at TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS memberships (
      user_id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      starts_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      auto_renew INTEGER DEFAULT 0,
      contract_id TEXT
    )
  `);

  return db;
}

async function getDb(): Promise<SqlJsDatabase> {
  if (_db) return _db;
  if (!_initPromise) {
    _initPromise = initDb();
  }
  _db = await _initPromise;
  return _db;
}

function persistDb(db: SqlJsDatabase) {
  try {
    const data = db.export();
    const buf = Buffer.from(data);
    const dbPath = getDbPath();
    mkdirSync(path.dirname(dbPath), { recursive: true });
    writeFileSync(dbPath, buf);
  } catch (e) {
    console.error("[db] persist error:", e);
  }
}

// ─── Orders ────────────────────────────────────────────────────────────────

export async function getOrder(id: string): Promise<DbOrder | undefined> {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM orders WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as DbOrder;
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

export async function upsertOrder(order: {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at?: string;
}) {
  const db = await getDb();
  const existing = await getOrder(order.id);
  if (existing) {
    db.run(
      "UPDATE orders SET status=?, paid_at=? WHERE id=?",
      [order.status, order.paid_at ?? null, order.id]
    );
  } else {
    db.run(
      "INSERT INTO orders (id,user_id,plan_id,amount,status,created_at,paid_at) VALUES (?,?,?,?,?,?,?)",
      [order.id, order.user_id, order.plan_id, order.amount, order.status, order.created_at, order.paid_at ?? null]
    );
  }
  persistDb(db);
}

// ─── Memberships ─────────────────────────────────────────────────────────

export async function getMembership(userId: string): Promise<DbMembership | undefined> {
  const db = await getDb();
  const stmt = db.prepare("SELECT * FROM memberships WHERE user_id = ?");
  stmt.bind([userId]);
  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as DbMembership;
    stmt.free();
    return row;
  }
  stmt.free();
  return undefined;
}

export async function upsertMembership(membership: {
  user_id: string;
  plan_id: string;
  status: string;
  starts_at: string;
  expires_at: string;
  auto_renew?: number;
  contract_id?: string;
}) {
  const db = await getDb();
  const existing = await getMembership(membership.user_id);
  if (existing) {
    db.run(
      "UPDATE memberships SET plan_id=?,status=?,starts_at=?,expires_at=?,auto_renew=?,contract_id=? WHERE user_id=?",
      [
        membership.plan_id,
        membership.status,
        membership.starts_at,
        membership.expires_at,
        membership.auto_renew ?? 0,
        membership.contract_id ?? null,
        membership.user_id,
      ]
    );
  } else {
    db.run(
      "INSERT INTO memberships (user_id,plan_id,status,starts_at,expires_at,auto_renew,contract_id) VALUES (?,?,?,?,?,?,?)",
      [
        membership.user_id,
        membership.plan_id,
        membership.status,
        membership.starts_at,
        membership.expires_at,
        membership.auto_renew ?? 0,
        membership.contract_id ?? null,
      ]
    );
  }
  persistDb(db);
}

export async function getExpiredMemberships(): Promise<DbMembership[]> {
  const db = await getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(
    "SELECT * FROM memberships WHERE status='active' AND expires_at <= ?"
  );
  stmt.bind([now]);
  const results: DbMembership[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as unknown as DbMembership);
  }
  stmt.free();
  return results;
}
