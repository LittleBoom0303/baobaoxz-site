// SQLite 数据库行类型
export interface SQLiteDB {
  pragma(pragma: string): void;
  exec(sql: string): void;
  prepare(sql: string): Statement;
}

export interface Statement {
  run(...args: unknown[]): RunResult;
  get(...args: unknown[]): unknown;
  all(...args: unknown[]): unknown[];
}

export interface RunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface OrderRow {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  status: "pending" | "paid" | "expired";
  created_at: string;
  paid_at: string | null;
}

export interface MembershipRow {
  user_id: string;
  plan_id: string;
  status: "active" | "expired";
  starts_at: string;
  expires_at: string;
  auto_renew: number;
  contract_id: string | null;
}
