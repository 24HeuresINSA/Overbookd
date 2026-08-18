import { isRegistrationFormStep } from "@overbookd/http";
import { HOME_URL, LOGIN_URL, REGISTER_URL } from "@overbookd/web-page";

export default defineNuxtRouteMiddleware(async (to) => {
  // Plus d'explication sur l'utilisation de useOidcAuth ici :
  // https://nuxtoidc.cloud/composable
  const oidc = useOidcAuth();
  await oidc.fetch();

  const isLoggedIn = oidc.loggedIn.value;
  const unauthenticatedPages = [LOGIN_URL, REGISTER_URL];
  const isUnauthenticatedPage = unauthenticatedPages.includes(to.path);

  if (!isLoggedIn && !isUnauthenticatedPage) {
    return navigateTo(LOGIN_URL);
  }

  if (isLoggedIn) {
    const registrationStore = useRegistrationStore();
    if (!registrationStore.fullyRegistered) {
      const registrationStep = await registrationStore.checkAuthenticatedUser();
      if (
        registrationStep &&
        isRegistrationFormStep(registrationStep) &&
        to.path !== REGISTER_URL
      ) {
        return navigateTo(REGISTER_URL);
      }
    }
    if (isUnauthenticatedPage) {
      return navigateTo(HOME_URL);
    }
  }
});
