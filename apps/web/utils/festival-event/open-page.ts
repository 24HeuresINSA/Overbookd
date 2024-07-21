type FestivalEventId = { id: number };

const FA_LINK = "fa";
const FT_LINK = "ft";
type FestivalEventLink = typeof FA_LINK | typeof FT_LINK;

export const openActivityInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openInNewTab(FA_LINK, id);
};

export const openActivity = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  open(event, FA_LINK, id);
};

export const openTaskInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openInNewTab(FT_LINK, id);
};

export const openTask = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  open(event, FT_LINK, id);
};

function openInNewTab(link: FestivalEventLink, id: number) {
  const router = useRouter();
  const taskRoute = router.resolve({ path: `/${link}/${id}` });
  window.open(taskRoute.href, "_blank");
}

function open(event: PointerEvent, link: FestivalEventLink, id: number) {
  if (event.ctrlKey) return openInNewTab(link, id);
  const router = useRouter();
  router.push({ path: `/${link}/${id}` });
}
