import { useAuthStore } from "~/stores/auth";
import { jwtDecode } from "jwt-decode";
import { isHttpError } from "~/utils/http/http-error.utils";
import { needToBeLoggedIn } from "~/utils/pages/unauthenticated";
import { HOME_URL, LOGIN_URL } from "@overbookd/web-page";
import { AuthRepository } from "~/repositories/auth.repository";

type Token = { exp: number };

export default defineNuxtRouteMiddleware(async (to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const { authenticate, logout } = useAuthStore();

  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");

  if (!accessToken.value || !refreshToken.value) {
    return handleUnauthenticatedRedirect();
  }

  const decodedToken: Token = jwtDecode(accessToken.value);
  if (isAccessTokenValid(decodedToken)) {
    authenticated.value = true;
    if (needToBeLoggedIn(to)) return;
    return { path: HOME_URL, query: to.query };
  }

  const res = await AuthRepository.refresh(refreshToken.value);
  if (isHttpError(res)) return handleUnauthenticatedRedirect();

  authenticate(res.accessToken, res.refreshToken);

  function handleUnauthenticatedRedirect() {
    logout();
    if (!needToBeLoggedIn(to)) return;
    abortNavigation();
    return LOGIN_URL;
  }
});

function isAccessTokenValid(token: Token): boolean {
  return token.exp * 1000 > Date.now();
}
