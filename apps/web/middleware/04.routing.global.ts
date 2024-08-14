import { findPage } from "../utils/navigation/pages/page-list";
import { HOME_URL } from "@overbookd/web-page";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const layoutStore = useLayoutStore();
  layoutStore.initializeResizeListener();

  const page = findPage(to.path);
  if (!page?.permission) return;

  if (!layoutStore.isDesktop && !page?.mobileSupport) {
    sendFailureNotification("Cette page n'est pas disponible sur mobile");
    return HOME_URL;
  }

  const hasPermission = userStore.can(page.permission);
  if (!hasPermission) return HOME_URL;
});
