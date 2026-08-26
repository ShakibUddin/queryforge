import { useEffect, useState } from "react";
import { initDatabase } from "./database/database";
import { executeQuery, type QueryResult } from "./database/query";

function App() {
  const [sql, setSql] = useState("SELECT * FROM users;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function setup() {
      try {
        setIsLoading(true);
        setError(null);

        await initDatabase();

        const queryResult = executeQuery("SELECT * FROM users;");

        setResult(queryResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    setup();
  }, []);

  function handleRunQuery() {
    try {
      setError(null);

      const queryResult = executeQuery(sql);

      setResult(queryResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (isLoading) {
    return <div>Loading database...</div>;
  }

  return (
    <div>
      <h1>QueryForge</h1>

      <textarea
        value={sql}
        onChange={(event) => setSql(event.target.value)}
        rows={8}
        cols={80}
      />

      <br />

      <button onClick={handleRunQuery}>Run</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <table>
          <thead>
            <tr>
              {result.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {result.values.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((value, columnIndex) => (
                  <td key={columnIndex}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
