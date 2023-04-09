interface BaseVolunteer {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
  comment?: string;
}

export interface Volunteer extends BaseVolunteer {
  teams: string[];
  assignments: number;
  friendAvailable?: boolean;
  isRequestedOnSamePeriod?: boolean;
  hasFriendAssigned?: boolean;
}

export interface AvailableVolunteer extends BaseVolunteer {
  teams: string[];
  assignments: number;
  friendAvailable: boolean;
  isRequestedOnSamePeriod: boolean;
  hasFriendAssigned: boolean;
}

export interface DatabaseVolunteer extends BaseVolunteer {
  team: {
    team: {
      code: string;
    };
  }[];
  _count?: {
    assignments: number;
    friends?: number;
    friendRequestors?: number;
    ftUserRequests?: number;
  };
}

export interface DatabaseVolunteerWithFriendRequests extends DatabaseVolunteer {
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
}
