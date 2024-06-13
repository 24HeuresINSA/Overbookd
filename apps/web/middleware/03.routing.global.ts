import { pages } from "../utils/pages/pages-list";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const page = pages.find((page) => page.to.startsWith(to.path));
  if (!page?.permission) return;

  const hasPermission = userStore.can(page.permission);
  if (!hasPermission) return "/";
});
