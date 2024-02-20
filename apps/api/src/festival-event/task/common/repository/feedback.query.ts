import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

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
