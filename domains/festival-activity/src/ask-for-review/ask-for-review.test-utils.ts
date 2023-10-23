const robocop = {
  id: 1,
  nickname: "Robocop",
  firstname: "Secu",
  lastname: "Rite",
};

const faker = {
  id: 2,
  nickname: "Faker",
  firstname: "Lee",
  lastname: "Sang-hyeok",
};

const dixCadenasPompier = { id: 1, name: "Cadenas Pompier", quantity: 10 };
const uneBouilloire = { id: 2, name: "Bouilloire", quantity: 1 };
const uneMultiprise = { id: 3, name: "Multiprise", quantity: 1 };

export const pcSecurite = {
  id: 1,
  general: {
    name: "PC Securite",
    description: "Tour de guet",
    categories: [],
    toPublish: false,
    photoLink: null,
    isFlagship: false,
    timeWindows: [],
  },
  inCharge: {
    adherent: robocop,
    team: "secu",
    contractors: [],
  },
  signa: {
    location: "Pas tes oignons",
    signages: [],
  },
  security: {
    specialNeed: "Une armee d'AS super malin",
  },
  inquiry: {
    timeWindows: [
      {
        start: new Date("2023-05-12 09:00"),
        end: new Date("2023-05-15 08:00"),
      },
    ],
    gears: [dixCadenasPompier, uneBouilloire],
    electricity: [],
    barriers: [],
  },
  supply: {
    electricity: [],
    water: null,
  },
};

export const finaleEsport = {
  id: 2,
  general: {
    name: "Finale esport",
    description:
      "Après une année de championnat de légende venez assister à la conclusion de cette saison !",
    categories: ["sport"],
    toPublish: true,
    photoLink:
      "https://tse1.mm.bing.net/th?id=OIP.Gic1SK5Di5WzX5l_Y2bQtAHaEK&pid=Api",
    isFlagship: true,
    timeWindows: [
      {
        start: new Date("2023-05-13 19:00"),
        end: new Date("2023-05-14 01:00"),
        id: "2-202305131900-202305140100",
      },
    ],
  },
  inCharge: {
    adherent: faker,
    team: "plazir",
    contractors: [],
  },
  signa: {
    location: "Amphi 3000",
    signages: [],
  },
  security: {
    specialNeed: "Une armee d'AS super malin",
  },
  inquiry: {
    timeWindows: [
      {
        start: new Date("2023-05-12 09:00"),
        end: new Date("2023-05-15 08:00"),
      },
    ],
    gears: [uneMultiprise],
    electricity: [],
    barriers: [],
  },
  supply: {
    electricity: [],
    water: null,
  },
};

export const internalWithoutDescription = {
  ...pcSecurite,
  id: 3,
  general: { ...pcSecurite.general, description: null },
};

export const publicWithoutPhoto = {
  ...finaleEsport,
  id: 4,
  general: { ...finaleEsport.general, photoLink: null },
};

export const publicWithoutCategory = {
  ...finaleEsport,
  id: 5,
  general: { ...finaleEsport.general, categories: [] },
};

export const publicWithoutTimeWindows = {
  ...finaleEsport,
  id: 6,
  general: { ...finaleEsport.general, timeWindows: [] },
};

export const internalWithoutTeamInCharge = {
  ...pcSecurite,
  id: 7,
  inCharge: { ...pcSecurite.inCharge, team: null },
};

export const internalWithoutLocation = {
  ...pcSecurite,
  id: 8,
  signa: { ...pcSecurite.signa, location: null },
};

export const internalWithoutInquiries = {
  ...pcSecurite,
  id: 9,
  inquiry: { ...pcSecurite.inquiry, gears: [] },
};

export const internalWithoutInquiryTimeWindows = {
  ...pcSecurite,
  id: 10,
  inquiry: { ...pcSecurite.inquiry, timeWindows: [] },
};

export const justCreated = {
  id: 11,
  inCharge: {
    adherent: robocop,
    team: null,
    contractors: [],
  },
  general: {
    name: "Test",
    description: null,
    categories: [],
    toPublish: false,
    photoLink: null,
    isFlagship: false,
    timeWindows: [],
  },
  signa: { location: null, signages: [] },
  security: { specialNeed: null },
  supply: { electricity: [], water: null },
  inquiry: { timeWindows: [], gears: [], barriers: [], electricity: [] },
};
