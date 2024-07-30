import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";

export const SELECT_CHARISMA_EVENT_PARTICIPATION = {
  slug: true,
  name: true,
  charisma: true,
  participant: { select: SELECT_USER_IDENTIFIER },
  eventDate: true,
};
