import {
  BACHE,
  DRAFT,
  Draft,
  IN_REVIEW,
  InReview,
  NOT_ASKING_TO_REVIEW,
  P17_16A_TETRA,
  P17_32A_TETRA,
  PANNEAU,
  REVIEWING,
} from "../festival-activity";

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

export const george = {
  id: 3,
  lastname: "Ergo",
  firstname: "George",
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
        id: "28071960-28072080",
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
        id: 1,
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
    signages: [
      {
        id: "panneau-escape-game-4x3",
        text: "Escape Game",
        quantity: 1,
        size: "4x3",
        type: PANNEAU,
        comment: null,
      },
      {
        id: "bache-bienvenue-10m-par-2m",
        text: "Bienvenue",
        quantity: 1,
        size: "10m par 2m",
        type: BACHE,
        comment: "Pour qu'on nous voit bien",
      },
    ],
  },
  security: {
    specialNeed: "Pas de besoin particulier",
  },
  inquiry: {
    timeWindows: [
      {
        id: "28071900-28072140",
        start: new Date("2023-05-17T11:00+02:00"),
        end: new Date("2023-05-17T15:00+02:00"),
      },
    ],
    gears: [
      {
        slug: "marteau",
        name: "Marteau",
        quantity: 2,
      },
    ],
    electricity: [
      {
        slug: "prise-murale",
        name: "Prise murale",
        quantity: 1,
      },
    ],
    barriers: [
      {
        slug: "vauban",
        name: "Vauban",
        quantity: 15,
      },
    ],
  },
  supply: {
    electricity: [
      {
        id: "lumiere-p17_16a_tetra",
        connection: P17_16A_TETRA,
        device: "Lumière",
        power: 100,
        count: 3,
        comment: "Ceci est un commentaire",
      },
      {
        id: "enceinte-p17_32a_tetra",
        connection: P17_32A_TETRA,
        device: "Enceinte",
        power: 200,
        count: 1,
        comment: null,
      },
    ],
    water: null,
  },
};

export const pcSecurite: InReview = {
  id: 2,
  status: IN_REVIEW,
  general: {
    name: "PC Securite",
    description: "Maintenir l'ordre est indispensable",
    categories: [],
    toPublish: false,
    photoLink: null,
    isFlagship: false,
    timeWindows: [
      {
        id: "28599360-28602600",
        start: new Date("2024-05-17T18:00+02:00"),
        end: new Date("2024-05-20T00:00+02:00"),
      },
    ],
  },
  inCharge: {
    adherent: lea,
    team: "secu",
    contractors: [],
  },
  signa: {
    location: "",
    signages: [],
  },
  security: {
    specialNeed: null,
  },
  supply: {
    electricity: [],
    water: null,
  },
  inquiry: {
    timeWindows: [],
    gears: [],
    electricity: [],
    barriers: [],
  },
  reviews: {
    humain: REVIEWING,
    signa: REVIEWING,
    secu: REVIEWING,
    matos: REVIEWING,
    elec: REVIEWING,
    barrieres: REVIEWING,
    comcom: NOT_ASKING_TO_REVIEW,
  },
};

export const justDance: InReview = {
  id: 3,
  status: IN_REVIEW,
  general: {
    name: "Just Dance",
    description: "Viens t'amuser en defiant tes amis en battle de dance",
    categories: ["Culture"],
    toPublish: true,
    photoLink: "https://pinterest.com/12345",
    isFlagship: false,
    timeWindows: [
      {
        id: "28071900-28072140",
        start: new Date("2023-05-17T11:00+02:00"),
        end: new Date("2023-05-17T15:00+02:00"),
      },
    ],
  },
  inCharge: {
    adherent: noel,
    team: "culture",
    contractors: [],
  },
  signa: {
    location: "",
    signages: [],
  },
  security: {
    specialNeed: null,
  },
  supply: {
    electricity: [],
    water: null,
  },
  inquiry: {
    timeWindows: [],
    gears: [],
    electricity: [],
    barriers: [],
  },
  reviews: {
    humain: REVIEWING,
    signa: REVIEWING,
    secu: REVIEWING,
    matos: REVIEWING,
    elec: REVIEWING,
    barrieres: REVIEWING,
    comcom: REVIEWING,
  },
};
