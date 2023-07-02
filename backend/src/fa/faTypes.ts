import { Prisma } from '@prisma/client';
import { TEAM_SELECT } from '../team/team.service';

export type FaResponse = Prisma.FaGetPayload<{
  select: typeof COMPLETE_FA_SELECT;
}>;

export type AllFaResponse = Prisma.FaGetPayload<{
  select: typeof ALL_FA_SELECT;
}>;

export type ExportSignaNeeds = {
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

export const COMPLETE_FA_SELECT = {
  id: true,
  name: true,
  type: true,
  teamId: true,
  userInChargeId: true,
  createdAt: true,
  locationId: true,
  status: true,
  description: true,
  securityNeed: true,
  isPassRequired: true,
  numberOfPass: true,
  waterNeed: true,
  waterFlowRequired: true,
  collaborators: {
    select: {
      collaborator: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          phone: true,
          email: true,
          company: true,
          comment: true,
        },
      },
    },
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
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  },
  faSitePublishAnimation: {
    select: {
      faId: true,
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

export const ALL_FA_SELECT = {
  id: true,
  name: true,
  type: true,
  teamId: true,
  createdAt: true,
  locationId: true,
  status: true,
  description: true,
  securityNeed: true,
  isPassRequired: true,
  numberOfPass: true,
  waterNeed: true,
  waterFlowRequired: true,
  isDeleted: true,
  userInCharge: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  },
  team: {
    select: {
      name: true,
    },
  },
  faValidation: {
    select: {
      team: {
        select: {
          id: true,
        },
      },
    },
  },
  faRefuse: {
    select: {
      team: {
        select: {
          id: true,
        },
      },
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
