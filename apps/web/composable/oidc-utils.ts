import { type OidcRole, OIDC_ROLES_CLAIMS } from "@overbookd/oidc";
import { LOGIN_URL } from "@overbookd/web-page";
import { useMyStore } from "~/stores/authenticated-user";

// Plus d'expliation sur l'utilisation de useOidcAuth ici :
// https://nuxtoidc.cloud/composable

export function userIsLoggedIn(oidc: ReturnType<typeof useOidcAuth>) {
  return oidc.loggedIn.value;
}

export function getUserRoles(oidc: ReturnType<typeof useOidcAuth>): OidcRole[] {
  const rolesObj = oidc.user.value?.userInfo?.[OIDC_ROLES_CLAIMS] ?? {};
  return Object.keys(rolesObj) as OidcRole[];
}

export function userHasRole(
  role: OidcRole,
  oidc: ReturnType<typeof useOidcAuth>,
) {
  const roles = getUserRoles(oidc);
  return roles.indexOf(role) !== -1;
}

export async function handleLogout(oidc: ReturnType<typeof useOidcAuth>) {
  await oidc.logout();
  await navigateTo(LOGIN_URL);
  useMyStore().clear();
}
