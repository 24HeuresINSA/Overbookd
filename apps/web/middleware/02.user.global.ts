import { isUnauthenticatedPages } from "~/utils/navigation/pages/unauthenticated";

export default defineNuxtRouteMiddleware(async (to) => {
  if (isUnauthenticatedPages(to)) return;

  const oidc = useOidcAuth();
  if (!oidc.loggedIn.value) return;

  const myStore = useMyStore();
  if (!myStore.synced) {
    await myStore.sync();
  }
  if (!myStore.loggedUser) {
    await myStore.fetchMyInformations();
  }

  const preferenceStore = usePreferenceStore();
  await preferenceStore.fetchMyPreferences();
});
