import path from "path";
import Database from "better-sqlite3";
import type { SQLiteDB } from "@/types/db";

let _db: SQLiteDB | null = null;

function openDb(): SQLiteDB {
  // Vercel serverless: /tmp is the only writable directory
  const dbPath = process.env.VERCEL
    ? "/tmp/flexichrono_pay.db"
    : path.join(process.cwd(), "pay.db");
  const db = new Database(dbPath) as SQLiteDB;
  db.pragma("journal_mode = WAL");
  // orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      plan_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      paid_at TEXT
    );
  `);
  // memberships table
  db.exec(`
    CREATE TABLE IF NOT EXISTS memberships (
      user_id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      starts_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      auto_renew INTEGER DEFAULT 0,
      contract_id TEXT
    );
  `);
  return db;
}

export function getDb(): SQLiteDB {
  if (_db) return _db;
  _db = openDb();
  return _db;
}

export function getOrder(id: string) {
  return getDb().prepare("SELECT * FROM orders WHERE id = ?").get(id);
}

export function upsertOrder(order: {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: string;
  created_at: string;
  paid_at?: string;
}) {
  const db = getDb();
  const existing = getOrder(order.id);
  if (existing) {
    db.prepare("UPDATE orders SET status=?, paid_at=? WHERE id=?").run(
      order.status,
      order.paid_at ?? null,
      order.id
    );
  } else {
    db.prepare(
      "INSERT INTO orders (id,user_id,plan_id,amount,status,created_at,paid_at) VALUES (?,?,?,?,?,?,?)"
    ).run(
      order.id,
      order.user_id,
      order.plan_id,
      order.amount,
      order.status,
      order.created_at,
      order.paid_at ?? null
    );
  }
}

export function getMembership(userId: string) {
  return getDb()
    .prepare("SELECT * FROM memberships WHERE user_id = ?")
    .get(userId);
}

export function upsertMembership(membership: {
  user_id: string;
  plan_id: string;
  status: string;
  starts_at: string;
  expires_at: string;
  auto_renew?: number;
  contract_id?: string;
}) {
  const db = getDb();
  const existing = getMembership(membership.user_id);
  if (existing) {
    db.prepare(
      "UPDATE memberships SET plan_id=?,status=?,starts_at=?,expires_at=?,auto_renew=?,contract_id=? WHERE user_id=?"
    ).run(
      membership.plan_id,
      membership.status,
      membership.starts_at,
      membership.expires_at,
      membership.auto_renew ?? 0,
      membership.contract_id ?? null,
      membership.user_id
    );
  } else {
    db.prepare(
      "INSERT INTO memberships (user_id,plan_id,status,starts_at,expires_at,auto_renew,contract_id) VALUES (?,?,?,?,?,?,?)"
    ).run(
      membership.user_id,
      membership.plan_id,
      membership.status,
      membership.starts_at,
      membership.expires_at,
      membership.auto_renew ?? 0,
      membership.contract_id ?? null
    );
  }
}

export function getExpiredMemberships() {
  const now = new Date().toISOString();
  return getDb()
    .prepare(
      "SELECT * FROM memberships WHERE status='active' AND expires_at <= ?"
    )
    .all(now);
}
