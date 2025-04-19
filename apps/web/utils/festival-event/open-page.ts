import { FA_URL, FT_URL } from "@overbookd/web-page";
import {
  openPageWithId,
  openPageWithIdInNewTab,
} from "../navigation/router.utils";

type FestivalEventId = { id: number };

export const openActivityInNewTabFromDataTable = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openPageWithIdInNewTab(FA_URL, id);
};

export const openActivityFromDataTable = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  openPageWithId(event, FA_URL, id);
};

export const openTaskInNewTabFromDataTable = (
  _: PointerEvent,
  { item }: { item: FestivalEventId },
) => {
  const { id } = { ...item };
  openPageWithIdInNewTab(FT_URL, id);
};

export const openTaskFromDataTable = (
  event: PointerEvent,
  target: { item: FestivalEventId },
) => {
  const { id } = { ...target.item };
  openPageWithId(event, FT_URL, id);
};
