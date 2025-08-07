import { isUnprotectedRoute } from "~/utils/navigation/pages/unauthenticated";
import { HOME_URL, LOGIN_URL } from "@overbookd/web-page";

export default defineNuxtRouteMiddleware(async (to) => {
  // Plus d'explication sur l'utilisation de useOidcAuth ici :
  // https://nuxtoidc.cloud/composable
  const oidc = useOidcAuth();
  await oidc.fetch();
  console.log(process.env.ZITADEL_BASE_URL);
  const isLoggedIn = oidc.loggedIn.value;
  const unprotectedRoute = isUnprotectedRoute(to);

  if (unprotectedRoute) {
    if (isLoggedIn) return navigateTo(HOME_URL);
  }

  if (!isLoggedIn && to.path !== LOGIN_URL) return navigateTo(LOGIN_URL);
});
