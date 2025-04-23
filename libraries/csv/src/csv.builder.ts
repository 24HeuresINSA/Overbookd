const DEFAULT_DELIMITER = ",";
const SPECIAL_CHARACTERS = /["\n\r,\\]/;
const ALL_QUOTES = /"/g;

type CsvObject = Record<string, unknown>;

type DeepPath<T, Key extends keyof T = keyof T> = T extends never
  ? never
  : Key extends string
    ? T[Key] extends CsvObject
      ? `${Key}.${DeepPath<T[Key]>}`
      : `${Key}`
    : never;

export class CSVBuilder<
  Item extends CsvObject,
  Header extends DeepPath<Item> = DeepPath<Item>,
> {
  private constructor(
    private readonly items: Item[],
    private readonly headers: Header[],
    private readonly delimiter: string = DEFAULT_DELIMITER,
    private readonly translations: Map<Header, string> = new Map(),
  ) {}

  static from<T extends CsvObject>(items: T[]): CSVBuilder<T, DeepPath<T>> {
    const headers = items.reduce((headers, item) => {
      const keys = extractKeys(item).filter((key) => isPath<T>(key));
      return new Set<DeepPath<T>>([...headers, ...keys]);
    }, new Set<DeepPath<T>>());

    return new CSVBuilder(items, [...headers]);
  }

  select(headers: Header[]): CSVBuilder<Item, Header> {
    return new CSVBuilder(
      this.items,
      headers,
      this.delimiter,
      this.translations,
    );
  }

  delimitWith(delimiter: string): CSVBuilder<Item, Header> {
    return new CSVBuilder(
      this.items,
      this.headers,
      delimiter,
      this.translations,
    );
  }

  translate(translations: [Header, string][]) {
    return new CSVBuilder(
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
        .map((key) => this.escapeWhenNeeded(get(item, key)))
        .join(this.delimiter),
    );

    return [headers, ...lines].join("\n");
  }

  private escapeWhenNeeded(value: unknown) {
    if (typeof value !== "string") return value;
    const hasSpecialCharacters = SPECIAL_CHARACTERS.test(value);
    const hasDelimiter = value.includes(this.delimiter);
    const shouldEscape = hasSpecialCharacters || hasDelimiter;
    return shouldEscape ? escape(value) : value;
  }
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

function escape(value: string): string {
  return `"${value.replace(ALL_QUOTES, '""')}"`;
}

function isPath<T>(key: string): key is DeepPath<T> {
  return true;
}

function extractKeys(value: object): string[] {
  return Object.entries(value).flatMap(([key, value]) =>
    isObject(value)
      ? extractKeys(value).map((nested) => `${key}.${nested}`)
      : key,
  );
}

function get<T extends CsvObject>(item: T, path: DeepPath<T>) {
  return path.split(".").reduce<unknown>((deepObject, key) => {
    if (!hasProperty(deepObject, key)) return undefined;
    return deepObject[`${key}`];
  }, item);
}

function hasProperty(item: unknown, key: string): item is { [key]: unknown } {
  return isObject(item) && key in item;
}
