import { getDatabase } from "./database";

export type QueryResult = {
    columns: string[];
    values: unknown[][];
};

export function executeQuery(sql: string): QueryResult | null {
    const db = getDatabase();

    const result = db.exec(sql);

    if (result.length === 0) {
        return null;
    }

    return result[0];
}