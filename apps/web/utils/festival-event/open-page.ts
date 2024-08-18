import { FA_URL, FT_URL } from "@overbookd/web-page";

type FestivalEventId = { id: number };

type FestivalEventLink = typeof FA_URL | typeof FT_URL;

export const openActivityInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openInNewTab(FA_URL, id);
};

export const openActivity = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  open(event, FA_URL, id);
};

export const openTaskInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openInNewTab(FT_URL, id);
};

export const openTask = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  open(event, FT_URL, id);
};

function openInNewTab(link: FestivalEventLink, id: number) {
  const router = useRouter();
  const taskRoute = router.resolve(`${link}/${id}`);
  window.open(taskRoute.href, "_blank");
}

function open(event: PointerEvent, link: FestivalEventLink, id: number) {
  if (event.ctrlKey) return openInNewTab(link, id);
  const router = useRouter();
  router.push(`${link}/${id}`);
}
