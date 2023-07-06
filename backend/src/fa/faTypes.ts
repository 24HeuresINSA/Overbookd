import { COLLABORATOR_SELECTION } from 'src/collaborator/collaborator.service';
import { TEAM_SELECT } from '../team/team.service';

export type ExportSignaNeed = {
  faId: number;
  faName: string;
  signaType: string;
  text: string;
  count: number;
  comment: string;
};

export type FaIdResponse = {
  id: number;
};

const USER_IN_CHARGE_SELECT = {
  select: {
    id: true,
    firstname: true,
    lastname: true,
  },
};

export const COMPLETE_FA_SELECT = {
  id: true,
  name: true,
  type: true,
  team: TEAM_SELECT,
  userInCharge: USER_IN_CHARGE_SELECT,
  createdAt: true,
  locationId: true,
  status: true,
  description: true,
  securityNeed: true,
  isPassRequired: true,
  numberOfPass: true,
  waterNeed: true,
  collaborator: {
    select: COLLABORATOR_SELECTION,
  },
  faValidation: {
    select: {
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      team: TEAM_SELECT,
    },
  },
  faRefuse: {
    select: {
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
      team: TEAM_SELECT,
    },
  },
  electricityNeeds: {
    select: {
      id: true,
      electricityType: true,
      device: true,
      power: true,
      count: true,
      comment: true,
    },
  },
  signaNeeds: {
    select: {
      id: true,
      signaType: true,
      text: true,
      count: true,
      comment: true,
    },
  },
  feedbacks: {
    select: {
      id: true,
      comment: true,
      subject: true,
      createdAt: true,
      author: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  },
  faSitePublishAnimation: {
    select: {
      photoLink: true,
      isFlagship: true,
      description: true,
      categories: true,
    },
  },
  timeWindows: {
    select: {
      id: true,
      start: true,
      end: true,
    },
  },
  fts: {
    select: {
      id: true,
      name: true,
      status: true,
    },
    where: { isDeleted: false },
  },
};

export const LITE_FA_SELECT = {
  id: true,
  name: true,
  team: TEAM_SELECT,
  status: true,
  isDeleted: true,
  userInCharge: USER_IN_CHARGE_SELECT,
  faValidation: {
    select: {
      team: TEAM_SELECT,
    },
  },
  faRefuse: {
    select: {
      team: TEAM_SELECT,
    },
  },
};

export const EXPORT_SIGNA_SELECT = {
  faId: true,
  signaType: true,
  text: true,
  count: true,
  comment: true,
  fa: {
    select: {
      name: true,
    },
  },
};
