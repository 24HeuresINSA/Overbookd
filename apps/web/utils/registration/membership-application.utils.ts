export const STAFF_APPLICATION_TOKEN_KEY = "staffApplicationToken";

export function planMembershipApplication(token?: string) {
  if (token) {
    localStorage.setItem(STAFF_APPLICATION_TOKEN_KEY, token);
    return;
  }
}
