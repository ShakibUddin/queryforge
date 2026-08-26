import type { QueryResult } from "../database/query";

type ResultsTableProps = {
  result: QueryResult;
};

function ResultsTable({ result }: ResultsTableProps) {
  if (result.values.length === 0) {
    return (
      <div className="results-container">
        <div className="results-header">
          <h2>Results</h2>
          <span>0 rows</span>
        </div>

        <div className="empty-results">
          Query executed successfully, but returned no rows.
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Results</h2>

        <span>
          {result.values.length} {result.values.length === 1 ? "row" : "rows"}
        </span>
      </div>

      <div className="table-wrapper">
        <table className="results-table">
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
                  <td key={columnIndex}>
                    {value === null ? (
                      <span className="null-value">NULL</span>
                    ) : (
                      String(value)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;
