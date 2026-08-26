import { useEffect, useState } from "react";
import { initDatabase } from "./database/database";
import { executeQuery, type QueryResult } from "./database/query";
import SqlEditor from "./components/SqlEditor";
import ResultsTable from "./components/ResultsTable";

type QueryStatus = "idle" | "success" | "error";

function App() {
  const [sql, setSql] = useState("SELECT * FROM users;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [queryStatus, setQueryStatus] = useState<QueryStatus>("idle");

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

      const startTime = performance.now();

      const queryResult = executeQuery(sql);

      const endTime = performance.now();

      setExecutionTime(endTime - startTime);
      setResult(queryResult);
      setQueryStatus("success");
    } catch (err) {
      setQueryStatus("error");
      setResult(null);

      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (isLoading) {
    return <div>Loading database...</div>;
  }

  return (
    <div>
      <h1>QueryForge</h1>

      <SqlEditor value={sql} onChange={setSql} />

      <br />

      <button onClick={handleRunQuery}>Run</button>
      {executionTime !== null && (
        <p>Query executed in {executionTime.toFixed(2)} ms</p>
      )}
      {queryStatus === "error" && error && (
        <div className="query-error">
          <strong>Query failed</strong>
          <p>{error}</p>
        </div>
      )}

      {result && <ResultsTable result={result} />}
    </div>
  );
}

export default App;
