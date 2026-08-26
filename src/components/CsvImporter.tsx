import { Upload } from "lucide-react";
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
    <label className="import-button">
      <Upload size={15} />
      Import CSV
      <input type="file" accept=".csv" onChange={handleFileChange} hidden />
    </label>
  );
}

export default CsvImporter;
