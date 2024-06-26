import { needToBeLoggedIn } from "~/utils/pages/logout-pages";

export default defineNuxtRouteMiddleware(async (to) => {
  if (!needToBeLoggedIn(to)) return;

  const userStore = useUserStore();
  if (userStore.loggedUser !== undefined) return;
  await userStore.fetchUser();
});
