import { useAuthStore } from "~/stores/auth";
import jwt_decode from "jwt-decode";

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
    if (to?.name === "login") return navigateTo("/");
    return;
  }

  const res = await AuthRepository.refresh(refreshToken.value);
  if (!res.ok) return handleUnauthenticatedRedirect();

  authenticate(res.data.accessToken, res.data.refreshToken);

  function handleUnauthenticatedRedirect() {
    logout();
    if (to?.name === "login") return;
    abortNavigation();
    return navigateTo("/login");
  }
});

function isAccessTokenValid(token: Token): boolean {
  return token.exp * 1000 > Date.now();
}
