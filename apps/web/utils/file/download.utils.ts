const CSV_EXTENSION = ".csv";

export function downloadCsv(filename: string, text: string) {
  const BOM = "\uFEFF";
  const textWithBOM = BOM + text;

  const blob = new Blob([textWithBOM], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const element = document.createElement("a");
  element.href = url;

  const withExtension = filename.endsWith(CSV_EXTENSION)
    ? filename
    : `${filename}${CSV_EXTENSION}`;
  element.setAttribute("download", withExtension);

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  URL.revokeObjectURL(url);
}
