import { useEffect, useState } from "react";
import { Database, Play } from "lucide-react";

import { initDatabase } from "./database/database";
import {
  createTable,
  getTables,
  insertRows,
  type TableInfo,
} from "./database/table";
import { executeQuery, type QueryResult } from "./database/query";
import { inferSchema } from "./database/schema";
import { getTableName } from "./database/tableName";

import SqlEditor from "./components/SqlEditor";
import ResultsTable from "./components/ResultsTable";
import CsvImporter from "./components/CsvImporter";

type QueryStatus = "idle" | "success" | "error";

function App() {
  const [sql, setSql] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [queryStatus, setQueryStatus] = useState<QueryStatus>("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState<TableInfo[]>([]);

  useEffect(() => {
    async function setup() {
      try {
        setIsLoading(true);
        setError(null);

        await initDatabase();

        setTables(getTables());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize database"
        );
      } finally {
        setIsLoading(false);
      }
    }

    setup();
  }, []);

  function handleRunQuery() {
    if (!sql.trim()) {
      return;
    }

    try {
      setError(null);
      setQueryStatus("idle");

      const startTime = performance.now();

      const queryResult = executeQuery(sql);

      const endTime = performance.now();

      setExecutionTime(endTime - startTime);
      setResult(queryResult);
      setQueryStatus("success");

      // Refresh table list in case the query
      // created or removed a table.
      setTables(getTables());
    } catch (err) {
      setResult(null);
      setQueryStatus("error");

      setError(err instanceof Error ? err.message : "Failed to execute query");
    }
  }

  function handleCsvImport(data: Record<string, string>[], fileName: string) {
    try {
      setError(null);
      setQueryStatus("idle");
      setResult(null);
      setExecutionTime(null);

      if (data.length === 0) {
        throw new Error("The CSV file contains no data.");
      }

      const tableName = getTableName(fileName);
      const schema = inferSchema(data);

      createTable(tableName, schema);
      insertRows(tableName, schema, data);

      // Refresh sidebar
      setTables(getTables());

      // Put a useful query into the editor
      setSql(`SELECT * FROM "${tableName}";`);
    } catch (err) {
      setQueryStatus("error");

      setError(err instanceof Error ? err.message : "Failed to import CSV");
    }
  }

  if (isLoading) {
    return (
      <div className="app-loading">
        <Database size={28} />
        <span>Starting SQLite...</span>
      </div>
    );
  }

  return (
    <div className="app">
      {/* =========================
          HEADER
      ========================= */}

      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <Database size={20} />
          </div>

          <div>
            <h1>QueryForge</h1>
            <span>Browser SQL Playground</span>
          </div>
        </div>

        <div className="header-actions">
          <CsvImporter onImport={handleCsvImport} />
        </div>
      </header>

      {/* =========================
          WORKSPACE
      ========================= */}

      <main className="workspace">
        {/* =========================
            SIDEBAR
        ========================= */}

        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section database-section">
              <div className="sidebar-title">
                <Database size={14} />
                <span>Database</span>

                {tables.length > 0 && (
                  <span className="table-count">{tables.length}</span>
                )}
              </div>

              {tables.length === 0 ? (
                <div className="empty-database">
                  <Database size={18} />
                  <span>No tables yet</span>
                  <small>Import a CSV to get started</small>
                </div>
              ) : (
                <div className="table-list">
                  {tables.map((table) => (
                    <div className="sidebar-table" key={table.name}>
                      <div className="table-name">
                        <span className="table-chevron">▾</span>

                        <div className="table-icon">▦</div>

                        <span className="table-name-text">{table.name}</span>

                        <span className="column-count">
                          {table.columns.length}
                        </span>
                      </div>

                      <div className="column-list">
                        {table.columns.map((column) => (
                          <div className="sidebar-column" key={column.name}>
                            <span className="column-icon">
                              {column.type === "TEXT" ? "A" : "#"}
                            </span>

                            <span className="column-name">{column.name}</span>

                            <span className="column-type">{column.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Query history placeholder */}
          <div className="sidebar-section history">
            <div className="sidebar-title">Query History</div>

            <div className="empty-database">No queries yet</div>
          </div>
        </aside>

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <section className="content">
          <div className="editor-header">
            <div>
              <h2>SQL Query</h2>

              <span>Execute SQLite directly in your browser</span>
            </div>

            <button
              className="run-button"
              onClick={handleRunQuery}
              disabled={!sql.trim()}
            >
              <Play size={15} fill="currentColor" />
              Run Query
            </button>
          </div>

          {/* SQL Editor */}

          <SqlEditor value={sql} onChange={setSql} />

          {/* Error */}

          {queryStatus === "error" && error && (
            <div className="query-error">
              <div>
                <strong>Query failed</strong>

                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Query metadata */}

          {queryStatus === "success" && (
            <div className="query-meta">
              {executionTime !== null && (
                <span>Executed in {executionTime.toFixed(2)} ms</span>
              )}

              {result && (
                <span>
                  {result.values.length}{" "}
                  {result.values.length === 1 ? "row" : "rows"}
                </span>
              )}

              {!result && <span>Query executed successfully</span>}
            </div>
          )}

          {/* Results */}

          {result && <ResultsTable result={result} />}
        </section>
      </main>
    </div>
  );
}

export default App;
