import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// 确保数据目录存在
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "site.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  initSchema(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      product_id TEXT NOT NULL,
      method TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'CNY',
      status TEXT DEFAULT 'pending',
      wxpay_qr_url TEXT,
      alipay_qr_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      paid_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS memberships (
      user_id TEXT PRIMARY KEY,
      status TEXT DEFAULT 'inactive',
      plan_id TEXT,
      started_at TEXT,
      expires_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

// --- User helpers ---
export function getOrCreateUser(userId: string): Database.RunResult {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (existing) return { changes: 0, lastInsertRowid: 0 };
  return db.prepare("INSERT INTO users (id) VALUES (?)").run(userId);
}

// --- Order helpers ---
export type Order = {
  id: string;
  user_id: string;
  product_id: string;
  method: string;
  amount: number;
  currency: string;
  status: string;
  wxpay_qr_url: string | null;
  alipay_qr_url: string | null;
  created_at: string;
  paid_at: string | null;
};

export function createOrder(order: Omit<Order, "created_at" | "paid_at">): Database.RunResult {
  const db = getDb();
  return db
    .prepare(
      `INSERT INTO orders (id, user_id, product_id, method, amount, currency, status, wxpay_qr_url, alipay_qr_url)
       VALUES (@id, @user_id, @product_id, @method, @amount, @currency, @status, @wxpay_qr_url, @alipay_qr_url)`
    )
    .run(order);
}

export function getOrder(orderId: string): Order | undefined {
  return getDb().prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as Order | undefined;
}

export function updateOrderStatus(orderId: string, status: string): Database.RunResult {
  const db = getDb();
  if (status === "paid") {
    return db
      .prepare("UPDATE orders SET status = ?, paid_at = datetime('now') WHERE id = ?")
      .run(status, orderId);
  }
  return db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);
}

// --- Membership helpers ---
export type Membership = {
  user_id: string;
  status: string;
  plan_id: string | null;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export function getMembership(userId: string): Membership | undefined {
  return getDb()
    .prepare("SELECT * FROM memberships WHERE user_id = ?")
    .get(userId) as Membership | undefined;
}

export function activateMembership(
  userId: string,
  planId: string,
  days: number
): Database.RunResult {
  const db = getDb();
  const now = new Date();
  const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // 若已有会员，顺延
  const existing = getMembership(userId);
  let finalExpires: Date;
  if (existing && existing.status === "active" && existing.expires_at) {
    const existingExpiry = new Date(existing.expires_at);
    finalExpires = new Date(existingExpiry.getTime() + days * 24 * 60 * 60 * 1000);
  } else {
    finalExpires = expires;
  }

  return db
    .prepare(
      `INSERT INTO memberships (user_id, status, plan_id, started_at, expires_at, updated_at)
       VALUES (?, 'active', ?, datetime('now'), ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET
         status = 'active',
         plan_id = excluded.plan_id,
         expires_at = excluded.expires_at,
         updated_at = datetime('now')`
    )
    .run(userId, planId, finalExpires.toISOString().replace("T", " ").slice(0, 19));
}

export function expireMembership(userId: string): Database.RunResult {
  const db = getDb();
  return db
    .prepare(
      `UPDATE memberships SET status = 'inactive', updated_at = datetime('now') WHERE user_id = ?`
    )
    .run(userId);
}

export function getExpiredMemberships(): Membership[] {
  return getDb()
    .prepare(
      `SELECT * FROM memberships WHERE status = 'active' AND expires_at < datetime('now')`
    )
    .all() as Membership[];
}
