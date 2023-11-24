import {
  AFFICHE,
  BACHE,
  DRAFT,
  Draft,
  IN_REVIEW,
  InReview,
  NOT_ASKING_TO_REVIEW,
  P17_16A_TETRA,
  P17_32A_TETRA,
  PANNEAU,
  PC16_Prise_classique,
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
    location: "BMC",
    signages: [],
  },
  security: {
    specialNeed: "Un vigil à l'entrée",
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
    contractors: [
      {
        id: 1,
        firstname: "Charles",
        lastname: "Henry",
        phone: "0111111111",
        email: "charles.henry@gmail.com",
        company: "Charles Company",
        comment: null,
      },
    ],
  },
  signa: {
    location: "Hall de la mde",
    signages: [
      {
        id: "affiche-just-dance-a2",
        size: "A2",
        type: AFFICHE,
        quantity: 24,
        text: "Just Dance",
        comment: null,
      },
      {
        id: "affiche-just-dance-10x3",
        size: "10x3",
        type: AFFICHE,
        quantity: 24,
        text: "Just Dance",
        comment: "fond bleu",
      },
    ],
  },
  security: {
    specialNeed: null,
  },
  supply: {
    electricity: [
      {
        id: "nintendo-switch-pc16_prise_classique",
        device: "Nintendo Switch",
        count: 1,
        connection: PC16_Prise_classique,
        power: 100,
        comment: "Pour jouer à Just Dance",
      },
    ],
    water: "Une fontaine pour se rafraichir",
  },
  inquiry: {
    timeWindows: [
      {
        id: "28071900-28072140",
        start: new Date("2023-05-17T11:00+02:00"),
        end: new Date("2023-05-17T15:00+02:00"),
      },
      {
        id: "28073340-28073580",
        start: new Date("2023-05-18T11:00+02:00"),
        end: new Date("2023-05-18T15:00+02:00"),
      },
    ],
    gears: [
      { slug: "plateau-de-dance", name: "Plateau de dance", quantity: 1 },
    ],
    electricity: [
      { slug: "multiprise-3-prises", name: "Multiprise 3 prises", quantity: 1 },
      { slug: "nintendo-switch", name: "Nintendo Switch", quantity: 1 },
    ],
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

export const baladeEnPoney: InReview = {
  id: 4,
  status: IN_REVIEW,
  general: {
    name: "Balade en poney",
    description: "Viens faire un tour de campus a dos de poney",
    categories: ["Enfants", "Divertissement"],
    toPublish: true,
    photoLink: "https://pinterest.com/936302",
    isFlagship: false,
    timeWindows: [
      {
        id: "28600560-28600800",
        start: new Date("2024-05-18T14:00+02:00"),
        end: new Date("2024-05-18T18:00+02:00"),
      },
      {
        id: "28602000-28602240",
        start: new Date("2024-05-19T14:00+02:00"),
        end: new Date("2024-05-19T18:00+02:00"),
      },
    ],
  },
  inCharge: {
    adherent: noel,
    team: "plaizir",
    contractors: [],
  },
  signa: {
    location: "Pelouse des humas",
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
    timeWindows: [
      {
        id: "28600560-28600800",
        start: new Date("2024-05-18T14:00+02:00"),
        end: new Date("2024-05-18T18:00+02:00"),
      },
    ],
    gears: [],
    electricity: [],
    barriers: [{ slug: "vauban", name: "Vauban", quantity: 30 }],
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

export const qgOrga: Draft = {
  id: 5,
  status: DRAFT,
  general: {
    name: "QG Orga",
    description: "Endroit ou tout le monde se retrouve",
    toPublish: false,
    photoLink: null,
    isFlagship: false,
    categories: ["Sport"],
    timeWindows: [
      {
        id: "28071960-28072080",
        start: new Date("2023-05-17T12:00+02:00"),
        end: new Date("2023-05-20T00:00+02:00"),
      },
    ],
  },
  inCharge: {
    adherent: george,
    team: "beboo",
    contractors: [],
  },
  signa: {
    location: "Agora",
    signages: [],
  },
  security: {
    specialNeed: null,
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
