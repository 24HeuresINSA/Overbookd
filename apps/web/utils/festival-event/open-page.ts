import { FA_URL, FT_URL } from "@overbookd/web-page";
import {
  openPageWithId,
  openPageWithIdInNewTab,
} from "../navigation/router.utils";

type FestivalEventId = { id: number };

export const openActivityInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openPageWithIdInNewTab(FA_URL, id);
};

export const openActivity = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  openPageWithId(event, FA_URL, id);
};

export const openTaskInNewTab = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openPageWithIdInNewTab(FT_URL, id);
};

export const openTask = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  openPageWithId(event, FT_URL, id);
};
