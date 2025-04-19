const DEFAULT_DELIMITER = ",";
type CsvData = string | number | boolean | null | undefined;

export const HEADERS_ERROR_MESSAGE =
  "Le nombre de colonnes dans les données ne correspond pas au nombre d'en-têtes";

export class CSVBuilder {
  private data: Record<string, CsvData>[] = [];
  private headers: string[] = [];
  private delimiter: string = DEFAULT_DELIMITER;

  withData(data: Record<string, CsvData>[]): CSVBuilder {
    this.data = data;
    return this;
  }

  withHeaders(headers: string[]): CSVBuilder {
    this.headers = headers;
    return this;
  }

  withDelimiter(delimiter: string): CSVBuilder {
    this.delimiter = delimiter;
    return this;
  }

  build(): string {
    if (this.data.length === 0) return "";

    const finalHeaders = this.headers.length
      ? this.headers
      : Object.keys(this.data[0]);

    const hasMismatch = this.data.some(
      (row) => Object.keys(row).length !== finalHeaders.length,
    );
    if (hasMismatch) throw new Error(HEADERS_ERROR_MESSAGE);

    const csvContent = this.data.map((row) => {
      return finalHeaders
        .map((key) => {
          const value = row[`${key}`];
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          const escapedValue = stringValue.replace(/"/g, '""');
          const hasSpecialCharacters =
            /["\n\r,\\]/.test(stringValue) ||
            stringValue.includes(this.delimiter);

          return hasSpecialCharacters ? `"${escapedValue}"` : escapedValue;
        })
        .join(this.delimiter);
    });

    const csvHeader = finalHeaders.join(this.delimiter);
    return [csvHeader, ...csvContent].join("\n");
  }
}
