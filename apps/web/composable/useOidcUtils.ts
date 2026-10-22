import { type OverbookdOidcRole, OIDC_ROLES_CLAIMS } from "@overbookd/oidc";
import { useMyStore } from "~/stores/authenticated-user";

// Plus d'expliation sur l'utilisation de useOidcAuth ici :
// https://nuxtoidc.cloud/composable

export function useOidcUtils() {
  const oidc = useOidcAuth();

  const userAccessToken = computed<string | undefined>(
    () => oidc.user.value?.accessToken,
  );

  const getUserAuthorizationHeader = ():
    { Authorization: string } | Record<never, unknown> =>
    userAccessToken.value
      ? { Authorization: `Bearer ${userAccessToken.value}` }
      : {};

  const userRoles = computed<OverbookdOidcRole[]>(() => {
    const rolesObj = oidc.user.value?.userInfo?.[`${OIDC_ROLES_CLAIMS}`] ?? {};
    return Object.keys(rolesObj) as OverbookdOidcRole[];
  });

  const doesUserHaveRole = (role: OverbookdOidcRole) =>
    userRoles.value.includes(role);

  // callbackRedirectUrl est validé côté serveur par nuxt-oidc-auth (chemin relatif uniquement)
  const login = (redirect?: string) => {
    const params = redirect ? { callbackRedirectUrl: redirect } : undefined;
    return oidc.login("zitadel", params);
  };

  const handleLogout = async () => {
    useMyStore().clear();
    await oidc.logout();
  };

  return {
    userAccessToken,
    getUserAuthorizationHeader,
    userRoles,
    doesUserHaveRole,
    login,
    handleLogout,
  };
}
