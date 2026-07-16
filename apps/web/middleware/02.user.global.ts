export default defineNuxtRouteMiddleware(async () => {
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
