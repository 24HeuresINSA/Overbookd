import { registrationSteps } from "@overbookd/http";
import { HOME_URL, LOGIN_URL, REGISTER_URL } from "@overbookd/web-page";
import { useOidcUtils } from "~/composable/useOidcUtils";
import { isUnauthenticatedPages } from "~/utils/navigation/pages/unauthenticated";

export default defineNuxtRouteMiddleware(async (to) => {
  // Plus d'explication sur l'utilisation de useOidcAuth ici :
  // https://nuxtoidc.cloud/composable
  const oidc = useOidcAuth();
  await oidc.fetch();

  const snackNotification = useSnackNotificationStore();

  const expireAt = oidc.user.value?.expireAt;
  if (expireAt && expireAt < Date.now() / 1000) {
    snackNotification.pushNotification(
      FAILURE,
      "Ta session a expiré, tu vas être redirigé vers la page de connexion.",
    );
    return useOidcUtils().handleLogout();
  }

  const isLoggedIn = oidc.loggedIn.value;

  if (!isLoggedIn && !isUnauthenticatedPages(to)) {
    return navigateTo(LOGIN_URL);
  }

  if (isLoggedIn) {
    const myStore = useMyStore();
    if (!myStore.fullyRegistered) {
      const registrationStep = await myStore.checkRegistration();
      if (!registrationStep) {
        snackNotification.pushNotification(
          FAILURE,
          "Une erreur est survenue 🥴 Essaye d'actualiser la page.",
        );
      }

      if (
        registrationStep === registrationSteps.FORM &&
        to.path !== REGISTER_URL
      ) {
        return navigateTo(REGISTER_URL);
      }

      if (
        registrationStep === registrationSteps.COMPLETED &&
        to.path === REGISTER_URL
      ) {
        return navigateTo(HOME_URL);
      }
    }

    if (to.path === LOGIN_URL) {
      return navigateTo(HOME_URL);
    }
  }
});
