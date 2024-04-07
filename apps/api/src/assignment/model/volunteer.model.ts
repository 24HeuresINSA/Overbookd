import { BaseVolunteer, Volunteer } from "@overbookd/assignment";

export type AvailableVolunteer = Volunteer & {
  friendAvailable: boolean;
  isRequestedOnSamePeriod: boolean;
  hasFriendAssigned: boolean;
};

export type DatabaseVolunteer = BaseVolunteer & {
  teams: {
    team: {
      code: string;
    };
  }[];
  _count?: {
    friends?: number;
    friendRequestors?: number;
    ftUserRequests?: number;
  };
  assignments: {
    timeSpan: {
      start: Date;
      end: Date;
    };
  }[];
};

export type DatabaseVolunteerWithFriendRequests = DatabaseVolunteer & {
  friends: {
    requestor: {
      id: number;
    };
  }[];
  friendRequestors: {
    friend: {
      id: number;
    };
  }[];
};
