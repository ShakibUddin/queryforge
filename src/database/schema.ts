export type SQLiteType = "INTEGER" | "REAL" | "TEXT";

export type ColumnSchema = {
    name: string;
    type: SQLiteType;
};

export function inferSchema(
    rows: Record<string, string>[]
): ColumnSchema[] {
    if (rows.length === 0) {
        return [];
    }

    const columnNames = Object.keys(rows[0]);

    return columnNames.map((columnName) => {
        const values = rows
            .map((row) => row[columnName])
            .filter((value) => value !== undefined && value.trim() !== "");

        return {
            name: columnName,
            type: inferColumnType(values),
        };
    });
}

function inferColumnType(values: string[]): SQLiteType {
    if (values.length === 0) {
        return "TEXT";
    }

    if (values.every((value) => /^-?\d+$/.test(value.trim()))) {
        return "INTEGER";
    }

    if (
        values.every((value) => {
            return !Number.isNaN(Number(value.trim()));
        })
    ) {
        return "REAL";
    }

    return "TEXT";
}