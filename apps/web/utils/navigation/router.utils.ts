export function openPageWithIdInNewTab(path: string, id: number) {
  const router = useRouter();
  const pageRoute = router.resolve(`${path}/${id}`);
  window.open(pageRoute.href);
}

export function openPageWithId(event: PointerEvent, path: string, id: number) {
  if (event.ctrlKey) return openPageWithIdInNewTab(path, id);
  navigateTo(`${path}/${id}`);
}

export function openPage(event: PointerEvent, path: string) {
  if (event.ctrlKey) return openPageInNewTab(path);
  navigateTo(path);
}

export function openPageInNewTab(path: string) {
  const router = useRouter();
  const pageRoute = router.resolve(path);
  window.open(pageRoute.href);
}
