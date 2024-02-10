import { SELECT_VOLUNTEER } from "./adherent/adherent.query";

export const SELECT_FEEDBACKS = {
  feedbacks: {
    select: {
      author: { select: SELECT_VOLUNTEER },
      content: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "asc" },
  },
} as const;
