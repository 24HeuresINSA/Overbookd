export function sanitizeFieldForCSV(field?: string | null): string {
  if (!field) return "";
  const includesSemicolon = field.includes(";");
  return includesSemicolon ? `"${field.replaceAll('"', '""')}"` : field;
}

export function booleanToReadableString(value: boolean): string {
  return value ? "Oui" : "Non";
}
