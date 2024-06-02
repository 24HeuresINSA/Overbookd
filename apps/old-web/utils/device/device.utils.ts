const MAX_MOBILE_WIDTH = 960;

export function isDesktop(): boolean {
  return window.screen.width >= MAX_MOBILE_WIDTH;
}
