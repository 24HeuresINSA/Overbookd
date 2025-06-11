import { useAuthStore } from "~/stores/auth";
import { isHttpError } from "~/utils/http/http-error.utils";
import { needToBeLoggedIn } from "~/utils/navigation/pages/unauthenticated";
import { HOME_URL, LOGIN_URL } from "@overbookd/web-page";
import { AuthRepository } from "~/repositories/auth.repository";
import { isTokenValid } from "~/utils/user/auth.utils";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const accessToken = useCookie(ACCESS_TOKEN);
  const refreshToken = useCookie(REFRESH_TOKEN);

  if (!accessToken.value || !refreshToken.value) {
    return handleUnauthenticatedRedirect();
  }

  if (isTokenValid(accessToken.value)) {
    authStore.authenticated = true;
    if (needToBeLoggedIn(to)) return;
    return { path: HOME_URL, query: to.query };
  }

  const res = await AuthRepository.refresh(refreshToken.value);
  if (isHttpError(res)) return handleUnauthenticatedRedirect();

  authStore.authenticate(res.accessToken, res.refreshToken);

  function handleUnauthenticatedRedirect() {
    authStore.logout();
    if (!needToBeLoggedIn(to)) return;
    abortNavigation();
    return LOGIN_URL;
  }
});
