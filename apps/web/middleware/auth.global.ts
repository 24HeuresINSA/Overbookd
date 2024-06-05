import { useAuthStore } from "~/stores/auth";
import jwt_decode from "jwt-decode";
import { isSuccess } from "~/utils/http/api-fetch";
import type { RouteLocationNormalized } from "vue-router";

type Token = { exp: number };

export default defineNuxtRouteMiddleware(async (to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const { authenticate, logout } = useAuthStore();

  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");

  if (!accessToken.value || !refreshToken.value) {
    return handleUnauthenticatedRedirect();
  }

  const decodedToken: Token = jwt_decode(accessToken.value);
  if (isAccessTokenValid(decodedToken)) {
    authenticated.value = true;
    if (isTargettingLoginPage(to)) return navigateTo("/");
    return;
  }

  const res = await AuthRepository.refresh(refreshToken.value);
  if (!isSuccess(res)) return handleUnauthenticatedRedirect();

  authenticate(res.accessToken, res.refreshToken);

  function handleUnauthenticatedRedirect() {
    logout();
    if (isTargettingLoginPage(to)) return;
    abortNavigation();
    return navigateTo("/login");
  }
});

function isAccessTokenValid(token: Token): boolean {
  return token.exp * 1000 > Date.now();
}

function isTargettingLoginPage(to: RouteLocationNormalized): boolean {
  return to.name === "login";
}
