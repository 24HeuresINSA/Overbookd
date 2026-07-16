import { findPage } from "~/utils/navigation/find-page.utils";
import { HOME_URL } from "@overbookd/web-page";
import { playJauneAudioIfNeeded } from "~/utils/easter-egg/jaune-audio";

export default defineNuxtRouteMiddleware((to) => {
  playJauneAudioIfNeeded(to);

  const myStore = useMyStore();
  const layoutStore = useLayoutStore();
  layoutStore.initializeResizeListener();

  const page = findPage(to.path);
  if (!page?.permission) return;

  if (layoutStore.isMobile && !page?.mobileSupport) {
    sendFailureNotification("Cette page n'est pas disponible sur mobile");
    return HOME_URL;
  }

  const hasPermission = myStore.can(page.permission);
  if (!hasPermission) return HOME_URL;
});
