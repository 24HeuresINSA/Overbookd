import { useAuthStore } from "~/stores/auth";
import { jwtDecode } from "jwt-decode";
import { isHttpError } from "~/utils/http/http-error.utils";
import { needToBeLoggedIn } from "~/utils/navigation/pages/unauthenticated";
import { HOME_URL, LOGIN_URL } from "@overbookd/web-page";
import { AuthRepository } from "~/repositories/auth.repository";

type Token = { exp: number };

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.accessToken || !authStore.refreshToken) {
    return handleUnauthenticatedRedirect();
  }

  const decodedToken: Token = jwtDecode(authStore.accessToken);
  if (isAccessTokenValid(decodedToken)) {
    authStore.authenticated = true;
    if (needToBeLoggedIn(to)) return;
    return { path: HOME_URL, query: to.query };
  }

  const res = await AuthRepository.refresh(authStore.refreshToken);
  if (isHttpError(res)) return handleUnauthenticatedRedirect();

  authStore.authenticate(res.accessToken, res.refreshToken);

  function handleUnauthenticatedRedirect() {
    authStore.logout();
    if (!needToBeLoggedIn(to)) return;
    abortNavigation();
    return LOGIN_URL;
  }
});

function isAccessTokenValid(token: Token): boolean {
  return token.exp * 1000 > Date.now();
}
