import { isUnauthenticatedPages } from "~/utils/navigation/pages/unauthenticated";
import { HOME_URL, LOGIN_URL } from "@overbookd/web-page";

export default defineNuxtRouteMiddleware(async (to) => {
  // Plus d'explication sur l'utilisation de useOidcAuth ici :
  // https://nuxtoidc.cloud/composable
  const oidc = useOidcAuth();
  await oidc.fetch();

  const isLoggedIn = oidc.loggedIn.value;
  const unauthenticatedPage = isUnauthenticatedPages(to);

  if (isLoggedIn && unauthenticatedPage) {
    return navigateTo(HOME_URL);
  }

  if (!isLoggedIn && !unauthenticatedPage) {
    return navigateTo(LOGIN_URL);
  }
});
