import {
  FtStatus,
  FtSubjectType,
  Prisma,
  reviewStatus,
  Status,
} from '@prisma/client';
import { UserRequest } from 'src/ft_user_request/dto/ftUserRequestResponse.dto';
import { PeriodForm } from 'src/gear-requests/gearRequests.service';
export class SignaLocation {
  id: number;
  name: string;
}
class UserName {
  firstname: string;
  lastname: string;
}

export class UserNameWithId extends UserName {
  id: number;
}

export class Team {
  id: number;
  name: string;
  color: string;
  icon: string;
  code: string;
}

export class TeamRequest {
  quantity: number;
  team: Team;
}

export interface TimeWindow {
  id: number;
  start: Date;
  end: Date;
  userRequests: UserRequest[];
  teamRequests: TeamRequest[];
  sliceTime: number;
}

export class Review {
  status: reviewStatus;
  team: Team;
}

export class Feedback {
  id: number;
  comment: string;
  subject: FtSubjectType;
  authorId: number;
  createdAt: Date;
  author: UserName;
}
export class MinimalFa {
  id: number;
  name: string;
  status: Status;
}

export interface CompleteFtResponse {
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
  team: Team | null;
  userInCharge: UserNameWithId | null;
  fa: MinimalFa | null;
}

export type LiteFtResponse = Prisma.FtGetPayload<{
  select: typeof LITE_FT_SELECT;
}>;
export interface AlsoRequestedByFT {
  id: number;
  name: string;
  period: PeriodForm;
}

export type FtIdResponse = Prisma.FtGetPayload<{
  select: typeof FT_ID_SELECT;
}>;

const TEAM_SELECT = {
  select: {
    id: true,
    name: true,
    code: true,
    color: true,
    icon: true,
  },
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
    },
  },
  reviews: REVIEWS_SELECT,
  team: TEAM_SELECT,
  userInCharge: DISPLAY_USER_WITH_ID_SELECT,
  fa: MINIMAL_FA_SELECT,
};

export const LITE_FT_SELECT = {
  id: true,
  name: true,
  status: true,
  userInCharge: DISPLAY_USER_WITH_ID_SELECT,
  team: TEAM_SELECT,
  fa: MINIMAL_FA_SELECT,
  reviews: REVIEWS_SELECT,
};

export const FT_ID_SELECT = {
  id: true,
};
