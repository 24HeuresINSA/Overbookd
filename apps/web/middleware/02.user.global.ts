export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  if (userStore.loggedUser === undefined) {
    await userStore.fetchUser();
  }
});
