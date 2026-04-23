export function pluralize(
  word: string,
  count: number,
  pluralSuffix: string = "s",
): string {
  return `${word}${count !== 1 ? pluralSuffix : ""}`;
}
