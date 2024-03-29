import { SELECT_BASE_TIMESPAN } from "../assignment/assignment.service";
import { UserRequest } from "../ft-user-request/dto/ft-user-request.response.dto";
import { TEAM_SELECT } from "../team/team.query";
import { FtStatus } from "./ft.model";
import { IProvidePeriod } from "@overbookd/period";
import { TimeSpanBase } from "../assignment/model/ft-time-span.model";
import { Team } from "../team/team.model";
import { ReviewStatus } from "../ft-review/ft-review.model";
import { FtFeedbackSubjectType } from "../ft-feedback/ft-feedback.model";
import { FestivalActivity } from "@overbookd/festival-event";

export class SignaLocation {
  id: number;
  name: string;
}
export class UserName {
  firstname: string;
  lastname: string;
  nickname?: string;
}

export class UserNameWithId extends UserName {
  id: number;
}

export class TeamRequest {
  quantity: number;
  team: Team;
}

export type TimeWindow = {
  id: number;
  start: Date;
  end: Date;
  sliceTime?: number;
  userRequests: UserRequest[];
  teamRequests: TeamRequest[];
  timeSpans: TimeSpanBase[];
};

export type TimeSpan = {
  timeWindowId: number;
  start: Date;
  end: Date;
  assignments: (UserRequestAssignment | TeamRequestAssignment)[];
};

type UserRequestAssignment = {
  assigneeId: number;
  userRequestId: number;
};

type TeamRequestAssignment = {
  assigneeId: number;
  teamRequestId: number;
};

export class Review {
  status: ReviewStatus;
  team: Team;
}

export class Feedback {
  id: number;
  comment: string;
  subject: FtFeedbackSubjectType;
  authorId: number;
  createdAt: Date;
  author: UserName;
}
export class MinimalFa {
  id: number;
  name: string;
  status: FestivalActivity["status"];
}

export type CompleteFtResponse = {
  id: number;
  name: string;
  status: FtStatus;
  isStatic: boolean;
  description: string;
  location: SignaLocation | null;
  isDeleted: boolean;
  feedbacks: Feedback[];
  timeWindows: TimeWindow[];
  reviews: Review[];
  reviewer?: UserNameWithId;
  team: Team | null;
  userInCharge: UserNameWithId | null;
  fa: MinimalFa | null;
};

export type LiteFtResponse = Pick<
  CompleteFtResponse,
  | "id"
  | "name"
  | "status"
  | "userInCharge"
  | "team"
  | "fa"
  | "reviews"
  | "reviewer"
>;
export type AlsoRequestedByFT = {
  id: number;
  name: string;
  period: IProvidePeriod;
};

export type FtIdResponse = {
  id: number;
};

const MINIMAL_FA_SELECT = {
  select: {
    id: true,
    name: true,
    status: true,
  },
};

const DISPLAY_USER_WITH_ID_SELECT = {
  select: {
    firstname: true,
    lastname: true,
    nickname: true,
    id: true,
  },
};

const FEEDBACK_SELECT = {
  select: {
    id: true,
    comment: true,
    subject: true,
    authorId: true,
    createdAt: true,
    author: {
      select: {
        firstname: true,
        lastname: true,
      },
    },
  },
};

const REVIEWS_SELECT = {
  select: {
    status: true,
    team: TEAM_SELECT,
  },
};

export const COMPLETE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  isStatic: true,
  description: true,
  location: {
    select: {
      id: true,
      name: true,
    },
  },
  isDeleted: true,
  feedbacks: FEEDBACK_SELECT,
  timeWindows: {
    select: {
      id: true,
      start: true,
      end: true,
      sliceTime: true,
      userRequests: {
        select: {
          id: true,
          user: DISPLAY_USER_WITH_ID_SELECT,
          ftTimeWindowsId: true,
        },
      },
      teamRequests: {
        select: {
          quantity: true,
          team: TEAM_SELECT,
        },
      },
      timeSpans: {
        select: SELECT_BASE_TIMESPAN,
      },
    },
  },
  reviews: REVIEWS_SELECT,
  team: TEAM_SELECT,
  userInCharge: DISPLAY_USER_WITH_ID_SELECT,
  fa: MINIMAL_FA_SELECT,
  reviewer: DISPLAY_USER_WITH_ID_SELECT,
};

export const LITE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  userInCharge: DISPLAY_USER_WITH_ID_SELECT,
  team: TEAM_SELECT,
  fa: MINIMAL_FA_SELECT,
  reviews: REVIEWS_SELECT,
  reviewer: DISPLAY_USER_WITH_ID_SELECT,
};
