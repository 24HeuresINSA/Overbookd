const FLIP_KEY = "flip";

export function shouldFlipContent(search?: string): boolean {
  const lowerSearch = search?.toLowerCase() ?? "";
  return lowerSearch.includes("bde");
}

export function shouldUnflipContent(search?: string): boolean {
  const lowerSearch = search?.toLowerCase() ?? "";
  return lowerSearch.includes("edb");
}

export function saveContentFlipped(): void {
  localStorage.setItem(FLIP_KEY, "1");
}

export function saveContentUnflipped(): void {
  localStorage.removeItem(FLIP_KEY);
}

export function isContentFlipped(): boolean {
  return localStorage.getItem(FLIP_KEY) === "1";
}
