import { COLLABORATOR_WITH_ID_SELECTION } from "../collaborator/collaborator.service";
import { SELECT_ELECTRICITY_NEED } from "../fa-electricity-need/fa-electricity-need.query";
import { SELECT_SIGNA_NEED } from "../fa-signa-need/fa-signa-need.query";
import { TEAM_SELECT } from "../team/team.query";

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
  numberOfPass: true,
  waterNeed: true,
  collaborator: {
    select: COLLABORATOR_WITH_ID_SELECTION,
  },
  electricityNeeds: {
    select: SELECT_ELECTRICITY_NEED,
  },
  signaNeeds: {
    select: SELECT_SIGNA_NEED,
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
  publicAnimation: {
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
};
