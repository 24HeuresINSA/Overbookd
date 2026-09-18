import { ONE_DAY_IN_MS } from "@overbookd/time";

const STAFF_TOKEN_KEY = "staffToken";

export function saveStaffToken(token: string): void {
  const item = { value: token, expiresAt: Date.now() + ONE_DAY_IN_MS };
  localStorage.setItem(STAFF_TOKEN_KEY, JSON.stringify(item));
}

export function getStaffToken(): string {
  const itemStr = localStorage.getItem(STAFF_TOKEN_KEY);
  if (!itemStr) return "";

  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiresAt) {
    removeStaffToken();
    return "";
  }
  return item.value;
}

export function removeStaffToken(): void {
  localStorage.removeItem(STAFF_TOKEN_KEY);
}
