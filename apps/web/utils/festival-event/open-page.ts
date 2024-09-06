import { FA_URL, FT_URL } from "@overbookd/web-page";
import { openPage, openPageInNewTab } from "../pages/router.utils";

type FestivalEventId = { id: number };

export const openActivityInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openPageInNewTab(FA_URL, id);
};

export const openActivity = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  openPage(event, FA_URL, id);
};

export const openTaskInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openPageInNewTab(FT_URL, id);
};

export const openTask = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  openPage(event, FT_URL, id);
};
