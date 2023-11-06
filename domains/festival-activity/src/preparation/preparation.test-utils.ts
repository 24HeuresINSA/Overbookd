import { DRAFT, Draft } from "../festival-activity";

const noel = {
  id: 1,
  firstname: "Noel",
  lastname: "Ertsemud",
};

export const lea = {
  id: 2,
  lastname: "Mouyno",
  firstname: "Lea",
};

export const escapeGame: Draft = {
  id: 1,
  status: DRAFT,
  general: {
    name: "Escape Game",
    description: null,
    toPublish: true,
    photoLink: "https://www.google.com",
    isFlagship: true,
    categories: ["Sport"],
    timeWindows: [
      {
        id: "1-28071960-28072080",
        start: new Date("2023-05-17T12:00+02:00"),
        end: new Date("2023-05-17T14:00+02:00"),
      },
    ],
  },
  inCharge: {
    adherent: noel,
    team: "culture",
    contractors: [
      {
        id: "1-1",
        firstname: "Jean",
        lastname: "Dupont",
        phone: "0123456789",
        email: "jean@gmail.com",
      },
    ],
  },
  signa: {
    location: "Creux CGU",
    signages: [],
  },
  security: {
    specialNeed: "Pas de besoin particulier",
  },
  inquiry: {
    timeWindows: [],
    gears: [],
    electricity: [],
    barriers: [],
  },
  supply: {
    electricity: [],
    water: null,
  },
};
