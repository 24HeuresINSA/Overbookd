import { DRAFT, Draft, electricityConnections } from "../festival-activity";

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
        company: null,
        comment: "Sympa",
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
    electricity: [
      {
        id: "1-lumiere-p17_16a_tetra",
        connection: electricityConnections.P17_16A_TETRA,
        device: "Lumière",
        power: 100,
        count: 3,
        comment: "Ceci est un commentaire",
      },
      {
        id: "1-enceinte-p17_32a_tetra",
        connection: electricityConnections.P17_32A_TETRA,
        device: "Enceinte",
        power: 200,
        count: 1,
        comment: null,
      },
    ],
    water: null,
  },
};
