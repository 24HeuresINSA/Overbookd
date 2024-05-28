import { useAuthStore } from "~/stores/auth";
import jwt_decode from "jwt-decode";

type Token = { exp: number };

export default defineNuxtRouteMiddleware(async (to) => {
  const { authenticated } = storeToRefs(useAuthStore());
  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");

  if (!accessToken.value || !refreshToken.value) {
    return handleUnauthenticatedRedirect();
  }

  const decoded: Token = jwt_decode(accessToken.value);
  if (decoded && decoded.exp * 1000 > Date.now()) {
    authenticated.value = true;
    if (to?.name === "login") return navigateTo("/");
    return;
  }

  const res = await AuthRepository.refresh(refreshToken.value);
  if (!res.ok) return handleUnauthenticatedRedirect();

  useCookie("accessToken").value = res.data.accessToken;
  useCookie("refreshToken").value = res.data.refreshToken;
  authenticated.value = true;

  function handleUnauthenticatedRedirect() {
    authenticated.value = false;
    if (to?.name === "login") return;
    abortNavigation();
    return navigateTo("/login");
  }
});
