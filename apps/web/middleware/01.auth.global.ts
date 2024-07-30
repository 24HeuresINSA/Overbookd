import { useAuthStore } from "~/stores/auth";
import { jwtDecode } from "jwt-decode";
import { isHttpError } from "~/utils/http/api-fetch";
import { needToBeLoggedIn } from "~/utils/pages/unauthenticated";

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
    if (!needToBeLoggedIn(to)) return "/";
    return;
  }

  const res = await AuthRepository.refresh(refreshToken.value);
  if (isHttpError(res)) return handleUnauthenticatedRedirect();

  authenticate(res.accessToken, res.refreshToken);

  function handleUnauthenticatedRedirect() {
    logout();
    if (!needToBeLoggedIn(to)) return;
    abortNavigation();
    return "/login";
  }
});

function isAccessTokenValid(token: Token): boolean {
  return token.exp * 1000 > Date.now();
}
