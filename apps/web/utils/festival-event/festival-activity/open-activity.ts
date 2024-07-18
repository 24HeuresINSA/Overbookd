type ActivityId = { id: number };

export const openActivityInNewTab = (
  _: PointerEvent,
  { item }: { item: ActivityId },
) => {
  const router = useRouter();
  const { id } = { ...item };
  const activityRoute = router.resolve({ path: `/fa/${id}` });
  window.open(activityRoute.href, "_blank");
};

export const openActivity = (
  event: PointerEvent,
  target: { item: ActivityId },
) => {
  if (event.ctrlKey) return openActivityInNewTab(event, target);
  const { id } = { ...target.item };

  const router = useRouter();
  router.push({ path: `/fa/${id}` });
};
