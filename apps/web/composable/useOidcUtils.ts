import { type OidcRole, OIDC_ROLES_CLAIMS } from "@overbookd/oidc";
import { LOGIN_URL } from "@overbookd/web-page";
import { useMyStore } from "~/stores/authenticated-user";

// Plus d'expliation sur l'utilisation de useOidcAuth ici :
// https://nuxtoidc.cloud/composable

export function useOidcUtils() {
  const oidc = useOidcAuth();

  const getUserRoles = (): OidcRole[] => {
    const rolesObj = oidc.user.value?.userInfo?.[`${OIDC_ROLES_CLAIMS}`] ?? {};
    return Object.keys(rolesObj) as OidcRole[];
  };

  const userHasRole = (role: OidcRole) => {
    const roles = getUserRoles();
    return roles.includes(role);
  };

  const handleLogout = async () => {
    await oidc.logout();
    await navigateTo(LOGIN_URL);
    useMyStore().clear();
  };

  return { getUserRoles, userHasRole, handleLogout };
}
