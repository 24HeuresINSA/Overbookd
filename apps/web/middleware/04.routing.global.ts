import { isDesktop } from "~/utils/device/device.utils";
import { findPage } from "../utils/pages/navigation";
import { HOME_URL } from "@overbookd/web-page";

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  const page = findPage(to.path);
  if (!page?.permission) return;

  const isMobile = !isDesktop();
  if (isMobile && !page?.mobileSupport) {
    sendFailureNotification("Cette page n'est pas disponible sur mobile");
    return HOME_URL;
  }

  const hasPermission = userStore.can(page.permission);
  if (!hasPermission) return HOME_URL;
});
