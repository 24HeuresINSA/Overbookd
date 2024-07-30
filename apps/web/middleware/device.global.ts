import MobileDetect from "mobile-detect";

export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp();
  const req = nuxtApp.ssrContext?.event.node.req;

  if (!req || !req.headers || !req.headers["user-agent"]) return;

  const md = new MobileDetect(req.headers["user-agent"]);
  const isMobile = md.phone() !== null || md.mobile() === "UnknownMobile";
  const isTablet = md.tablet() !== null || md.mobile() === "UnknownTablet";
  const isDesktop = !isMobile && !isTablet;

  const deviceStore = useDeviceStore();
  deviceStore.setDesktop(isDesktop);
});
