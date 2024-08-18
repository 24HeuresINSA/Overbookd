import { useAuthStore } from "~/stores/auth";
import { jwtDecode } from "jwt-decode";
import { isHttpError } from "~/utils/http/api-fetch";
import { needToBeLoggedIn } from "~/utils/pages/unauthenticated";
import { HOME_URL, LOGIN_URL } from "@overbookd/web-page";

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
    if (!needToBeLoggedIn(to)) return HOME_URL;
    return;
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
