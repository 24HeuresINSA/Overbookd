export function download(filename: string, text: string) {
  const BOM = "\uFEFF";
  const textWithBOM = BOM + text;

  const blob = new Blob([textWithBOM], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const element = document.createElement("a");
  element.href = url;
  element.setAttribute("download", filename);

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  URL.revokeObjectURL(url);
}
