export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getInitials(...names: string[]): string {
  return names
    .flatMap((name) => name.split(" "))
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}
