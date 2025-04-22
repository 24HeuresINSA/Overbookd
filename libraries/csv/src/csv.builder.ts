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

const SPECIAL_CHARACTERS = /["\n\r,\\]/;
const ALL_QUOTES = /"/g;

type CsvObject = Record<string, CsvData>;

export class CSVBuilderB<
  Item extends CsvObject,
  Header extends keyof Item = keyof Item,
> {
  private constructor(
    private readonly items: Item[],
    private readonly headers: Header[],
    private readonly delimiter: string = DEFAULT_DELIMITER,
    private readonly translations: Map<Header, string> = new Map(),
  ) {}

  static from<T extends CsvObject>(items: T[]): CSVBuilderB<T, keyof T> {
    const headers = Object.keys(items.at(0) ?? {});
    return new CSVBuilderB(items, headers);
  }

  select(headers: Header[]): CSVBuilderB<Item, Header> {
    return new CSVBuilderB(
      this.items,
      headers,
      this.delimiter,
      this.translations,
    );
  }

  delimitWith(delimiter: string): CSVBuilderB<Item, Header> {
    return new CSVBuilderB(
      this.items,
      this.headers,
      delimiter,
      this.translations,
    );
  }

  translate(translations: [Header, string][]) {
    return new CSVBuilderB(
      this.items,
      this.headers,
      this.delimiter,
      new Map(translations),
    );
  }

  build(): string {
    const headers = this.headers
      .map((header) => this.translations.get(header) ?? header)
      .join(this.delimiter);

    const lines = this.items.map((item) =>
      this.headers
        .map((key) => this.escapeWhenNeeded(item[key.toString()]))
        .join(this.delimiter),
    );

    return [headers, ...lines].join("\n");
  }

  private escapeWhenNeeded(value: CsvData) {
    if (typeof value !== "string") return value;
    const hasSpecialCharacters = SPECIAL_CHARACTERS.test(value);
    const hasDelimiter = value.includes(this.delimiter);
    const shouldEscape = hasSpecialCharacters || hasDelimiter;
    return shouldEscape ? escape(value) : value;
  }
}

function escape(value: string): string {
  return `"${value.replace(ALL_QUOTES, '""')}"`;
}
