import { getDatabase } from "./database";
import type { ColumnSchema } from "./schema";

export function createTable(
    tableName: string,
    schema: ColumnSchema[]
) {
    const db = getDatabase();

    db.run(`DROP TABLE IF EXISTS "${tableName}";`);

    const columns = schema
        .map((column) => `"${column.name}" ${column.type}`)
        .join(", ");

    const sql = `
    CREATE TABLE "${tableName}" (
      ${columns}
    );
  `;

    db.run(sql);
}

export function insertRows(
    tableName: string,
    schema: ColumnSchema[],
    rows: Record<string, string>[]
) {
    const db = getDatabase();

    const columns = schema
        .map((column) => `"${column.name}"`)
        .join(", ");

    const placeholders = schema
        .map(() => "?")
        .join(", ");

    const statement = db.prepare(`
      INSERT INTO "${tableName}" (${columns})
      VALUES (${placeholders});
    `);

    try {
        for (const row of rows) {
            const values = schema.map((column) => {
                const value = row[column.name];

                if (value === undefined || value.trim() === "") {
                    return null;
                }

                return convertValue(value, column.type);
            });

            statement.run(values);
        }
    } finally {
        statement.free();
    }
}

function convertValue(
    value: string,
    type: ColumnSchema["type"]
) {
    switch (type) {
        case "INTEGER":
            return Number.parseInt(value, 10);

        case "REAL":
            return Number.parseFloat(value);

        case "TEXT":
            return value;

        default:
            return value;
    }
}