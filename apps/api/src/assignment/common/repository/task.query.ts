import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";

const NOT_READY_TO_ASSIGN = {
  status: { not: READY_TO_ASSIGN },
} as const;

export const EXISTS_AND_NOT_READY_TO_ASSIGN = {
  ...IS_NOT_DELETED,
  ...NOT_READY_TO_ASSIGN,
} as const;
