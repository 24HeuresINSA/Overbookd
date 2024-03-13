import { HttpStringified } from "@overbookd/http";
import { User } from "@overbookd/user";

export const TaskCategories = {
  STATIQUE: "STATIQUE",
  BAR: "BAR",
  MANUTENTION: "MANUTENTION",
  FUN: "FUN",
  RELOU: "RELOU",
  AUCUNE: "AUCUNE",
};

export type TaskCategory = keyof typeof TaskCategories;

export type TaskCategoryEmoji = "🥶" | "🍻" | "👷" | "😂" | "🥱" | "🤷‍♂️";

export const TaskCategoryEmojis: Record<TaskCategory, TaskCategoryEmoji> = {
  STATIQUE: "🥶",
  BAR: "🍻",
  MANUTENTION: "👷",
  FUN: "😂",
  RELOU: "🥱",
  AUCUNE: "🤷‍♂️",
};

export const TaskCategoryEmojiMap: Map<TaskCategory, TaskCategoryEmoji> =
  new Map([
    ["STATIQUE", TaskCategoryEmojis.STATIQUE],
    ["BAR", TaskCategoryEmojis.BAR],
    ["MANUTENTION", TaskCategoryEmojis.MANUTENTION],
    ["FUN", TaskCategoryEmojis.FUN],
    ["RELOU", TaskCategoryEmojis.RELOU],
    ["AUCUNE", TaskCategoryEmojis.AUCUNE],
  ]);

export const TaskPriorities = {
  PRIORITAIRE: "PRIORITAIRE",
  NON_PRIORITAIRE: "NON PRIORITAIRE",
};

export type TaskPriority = keyof typeof TaskPriorities;

export type FtTimeSpanParameters = {
  hasPriority: boolean;
  category?: TaskCategory;
};

export type SimplifiedFT = FtTimeSpanParameters & {
  id: number;
  name: string;
};

export type RequestedTeam = {
  code: string;
  quantity: number;
  assignmentCount: number;
};

export type FtTimeSpan = {
  id: number;
  start: Date;
  end: Date;
};

export type FtTimeSpanWithRequestedTeams = FtTimeSpan & {
  requestedTeams: RequestedTeam[];
};

export type FtTimeSpanEvent = FtTimeSpan & {
  name: string;
  color: string;
  timed: boolean;
};

export type AvailableTimeSpan = FtTimeSpanWithRequestedTeams & {
  ft: SimplifiedFT;
  hasFriendsAssigned: boolean;
};

export type TimeSpanAssignee = User & {
  teams: string[];
  assignedTeam: string;
  friends: User[];
};

export type TimeSpanWithAssignees = FtTimeSpanWithRequestedTeams & {
  ft: {
    id: number;
    name: string;
    location: string;
  };
  requiredVolunteers: User[];
  assignees: TimeSpanAssignee[];
};

export type FtWithTimeSpan = SimplifiedFT & {
  timeSpans: FtTimeSpanWithRequestedTeams[];
};

export function getRequiredTeamsInFt(ft: FtWithTimeSpan): string[] {
  const teams = ft.timeSpans.flatMap((timeSpan) =>
    timeSpan.requestedTeams.map((team) => team.code),
  );
  return [...new Set(teams)];
}

export function castAvailableTimeSpansWithDate(
  timeSpansWithFt: HttpStringified<AvailableTimeSpan[]>,
): AvailableTimeSpan[] {
  return timeSpansWithFt.map((timeSpanWithFt) =>
    castAvailableTimeSpanWithDate(timeSpanWithFt),
  );
}

export function castAvailableTimeSpanWithDate(
  timeSpanWithFt: HttpStringified<AvailableTimeSpan>,
): AvailableTimeSpan {
  return {
    ...timeSpanWithFt,
    start: new Date(timeSpanWithFt.start),
    end: new Date(timeSpanWithFt.end),
  };
}

export function castFtsWithTimeSpansWithDate(
  ftWithTimeSpans: HttpStringified<FtWithTimeSpan[]>,
): FtWithTimeSpan[] {
  return ftWithTimeSpans.map((ftWithTimeSpan) =>
    castFtWithTimeSpansWithDate(ftWithTimeSpan),
  );
}

export function castFtWithTimeSpansWithDate(
  ftWithTimeSpan: HttpStringified<FtWithTimeSpan>,
): FtWithTimeSpan {
  return {
    ...ftWithTimeSpan,
    timeSpans: ftWithTimeSpan.timeSpans.map((timeSpan) => ({
      ...timeSpan,
      start: new Date(timeSpan.start),
      end: new Date(timeSpan.end),
    })),
  };
}
