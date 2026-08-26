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

    seedDatabase(db);

    return db;
}

function seedDatabase(db: Database) {
    db.run(`
    CREATE TABLE users (
      id INTEGER,
      name TEXT,
      age INTEGER
    );
  `);

    db.run(`
    INSERT INTO users (id, name, age)
    VALUES
      (1, 'Alice', 25),
      (2, 'Bob', 30),
      (3, 'Charlie', 35);
  `);
}

export function getDatabase() {
    if (!db) {
        throw new Error("Database has not been initialized");
    }

    return db;
}