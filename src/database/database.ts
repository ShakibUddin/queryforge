import initSqlJs, { type Database } from "sql.js";

let db: Database | null = null;

export async function initDatabase() {
  if (db) {
    return db;
  }

  const SQL = await initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });

  db = new SQL.Database();

  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error("Database has not been initialized");
  }

  return db;
}