import Papa from "papaparse";

type CsvImporterProps = {
  onImport: (data: Record<string, string>[], fileName: string) => void;
};

function CsvImporter({ onImport }: CsvImporterProps) {
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        onImport(results.data, file.name);
      },

      error: (error) => {
        console.error("CSV parsing failed:", error);
      },
    });
  }

  return (
    <div>
      <label htmlFor="csv-file">Import CSV</label>

      <input
        id="csv-file"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default CsvImporter;
