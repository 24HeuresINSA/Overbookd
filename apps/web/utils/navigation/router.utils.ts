export function openPageWithIdInNewTab(path: string, id: number) {
  const router = useRouter();
  const taskRoute = router.resolve(`${path}/${id}`);
  window.open(taskRoute.href, "_blank");
}

export function openPageWithId(event: PointerEvent, path: string, id: number) {
  if (event.ctrlKey) return openPageWithIdInNewTab(path, id);
  navigateTo(`${path}/${id}`);
}
