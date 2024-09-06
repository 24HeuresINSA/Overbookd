export function openPageInNewTab(path: string, id: number) {
  const router = useRouter();
  const taskRoute = router.resolve(`${path}/${id}`);
  window.open(taskRoute.href, "_blank");
}

export function openPage(event: PointerEvent, path: string, id: number) {
  if (event.ctrlKey) return openPageInNewTab(path, id);
  navigateTo(`${path}/${id}`);
}
