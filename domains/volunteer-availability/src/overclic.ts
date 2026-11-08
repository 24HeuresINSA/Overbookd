import type { User } from "@overbookd/user";

export type OverClicUser = User & { profilePicture?: string | null };

export type OverClicScore = {
  id: number;
  score: number;
  createdAt: Date;
  user: OverClicUser;
};

export type CreateOverClicScoreForm = {
  score: number;
};
