type PrimitiveParams = string | number | boolean | Date;
type NullablePrimitiveParams = PrimitiveParams | null | undefined;
type SupportedParams = NullablePrimitiveParams | NullablePrimitiveParams[];
export type Params = Record<string, SupportedParams>;
type ParamsEntry = [string, SupportedParams];
type URLEntry = [string, string];

export class HttpParams {
  static generate(params: Params): URLSearchParams {
    const entries = Object.entries(params);
    const searchOptions = entries.flatMap(HttpParams.toUrlQueryFormat);
    return new URLSearchParams(searchOptions);
  }

  private static toUrlQueryFormat([key, value]: ParamsEntry): URLEntry[] {
    if (Array.isArray(value)) {
      return value
        .map((item) => {
          if (item === null || item === undefined) return undefined;
          return [`${key}[]`, HttpParams.toSearchOption(item)];
        })
        .filter((item): item is URLEntry => item !== undefined);
    }
    if (value === null || value === undefined) return [];
    return [[key, HttpParams.toSearchOption(value)]];
  }

  private static toSearchOption(item: PrimitiveParams): string {
    if (item instanceof Date) return item.toISOString();
    return item?.toString() ?? "";
  }
}
