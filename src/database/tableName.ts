export function getTableName(fileName: string): string {
    const nameWithoutExtension = fileName
        .replace(/\.[^/.]+$/, "")
        .trim();

    const tableName = nameWithoutExtension
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/^(\d)/, "_$1");

    if (!tableName) {
        throw new Error("Could not determine a valid table name");
    }

    return tableName;
}