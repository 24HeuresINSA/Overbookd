import { isDesktop } from "~/utils/device/device.utils";
import { pages } from "../utils/pages/navigation";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  const page = pages.find((page) => page.to.startsWith(to.path));
  if (!page?.permission) return;

  const isMobile = !isDesktop();
  if (isMobile && !page?.mobileSupport) {
    sendFailureNotification("Cette page n'est pas disponible sur mobile");
    return "/";
  }

  const hasPermission = userStore.can(page.permission);
  if (!hasPermission) return "/";
});
