import { SELECT_BASE_USER } from "../../user/user.query";

export const SELECT_CHARISMA_EVENT_PARTICIPATION = {
  slug: true,
  name: true,
  charisma: true,
  participant: { select: SELECT_BASE_USER },
  eventDate: true,
};
