import { SELECT_ADHERENT } from "./adherent.query";
import { SELECT_LOCATION } from "./location.query";

const SELECT_REVIEW = {
  team: true,
  status: true,
};

const SELECT_TIME_WINDOW = {
  id: true,
  start: true,
  end: true,
};

const SELECT_GENERAL = {
  name: true,
  description: true,
  toPublish: true,
  photoLink: true,
  isFlagship: true,
  categories: true,
  generalTimeWindows: { select: SELECT_TIME_WINDOW },
};

const SELECT_IN_CHARGE = {
  teamCode: true,
  adherent: {
    select: SELECT_ADHERENT,
  },
  contractors: {
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
};

const SELECT_SIGNA = {
  location: { select: SELECT_LOCATION },
  signages: {
    select: {
      id: true,
      quantity: true,
      text: true,
      size: true,
      type: true,
      comment: true,
    },
  },
};

const SELECT_SECURITY = {
  specialNeed: true,
};

const SELECT_SUPPLY = {
  electricity: {
    select: {
      id: true,
      connection: true,
      device: true,
      count: true,
      power: true,
      comment: true,
    },
  },
  water: true,
};

const SELECT_INQUIRY = {
  inquiryTimeWindows: { select: SELECT_TIME_WINDOW },
  inquiries: {
    select: {
      slug: true,
      quantity: true,
      catalogItem: {
        select: {
          name: true,
          category: {
            select: {
              owner: { select: { code: true } },
            },
          },
        },
      },
    },
  },
};

export const SELECT_FESTIVAL_ACTIVITY = {
  id: true,
  status: true,
  reviews: { select: SELECT_REVIEW },
  ...SELECT_GENERAL,
  ...SELECT_IN_CHARGE,
  ...SELECT_SIGNA,
  ...SELECT_SECURITY,
  ...SELECT_SUPPLY,
  ...SELECT_INQUIRY,
};
