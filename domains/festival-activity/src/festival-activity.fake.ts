import { AFFICHE, BACHE, PANNEAU } from "./sections/signa";
import {
  ElectricitySupply,
  P17_16A_TETRA,
  P17_32A_TETRA,
  PC16_Prise_classique,
} from "./sections/supply";
import { Signage } from "./sections/signa";
import { Contractor } from "./sections/in-charge";

export const noel = {
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
export const robocop = {
  id: 4,
  nickname: "Robocop",
  firstname: "Secu",
  lastname: "Rite",
};
export const faker = {
  id: 5,
  nickname: "Faker",
  firstname: "Lee",
  lastname: "Sang-hyeok",
};

export const friday09hToMonday08h = {
  id: "28598820-28603080",
  start: new Date("2024-05-17T09:00+02:00"),
  end: new Date("2024-05-20T08:00+02:00"),
};
export const friday11hToFriday15h = {
  id: "28071900-28072140",
  start: new Date("2023-05-17T11:00+02:00"),
  end: new Date("2023-05-17T15:00+02:00"),
};
export const friday12hToFriday14h = {
  id: "28071960-28072080",
  start: new Date("2023-05-17T12:00+02:00"),
  end: new Date("2023-05-17T14:00+02:00"),
};
export const friday12hToMonday00h = {
  id: "28071960-28072080",
  start: new Date("2023-05-17T12:00+02:00"),
  end: new Date("2023-05-20T00:00+02:00"),
};
export const friday18hToMonday00h = {
  id: "28599360-28602600",
  start: new Date("2024-05-17T18:00+02:00"),
  end: new Date("2024-05-20T00:00+02:00"),
};
export const saturday11hToSaturday15h = {
  id: "28073340-28073580",
  start: new Date("2023-05-18T11:00+02:00"),
  end: new Date("2023-05-18T15:00+02:00"),
};
export const saturday11hToSaturday18h = {
  id: "28073340-28073760",
  start: new Date("2023-05-18T11:00+02:00"),
  end: new Date("2023-05-18T18:00+02:00"),
};
export const saturday14hToSaturday18h = {
  id: "28600560-28600800",
  start: new Date("2024-05-18T14:00+02:00"),
  end: new Date("2024-05-18T18:00+02:00"),
};
export const saturday19hToSunday01h = {
  start: new Date("2024-05-18T19:00+02:00"),
  end: new Date("2024-05-19T01:00+02:00"),
  id: "28600860-28601220",
};
export const sunday14hToSunday18h = {
  id: "28602000-28602240",
  start: new Date("2024-05-19T14:00+02:00"),
  end: new Date("2024-05-19T18:00+02:00"),
};

export const videoGameCollectif = {
  id: 1,
  firstname: "Charles",
  lastname: "Henry",
  phone: "0111111111",
  email: "charles.henry@video-game.com",
  company: "Video Game Collectif",
  comment: null,
};
export const neverEscape = {
  id: 2,
  firstname: "Jean",
  lastname: "Dupont",
  phone: "0123456789",
  email: "jean@neverEscape.com",
  company: null,
  comment: "Sympa",
};

export const afficheJustDanceA2: Signage = {
  id: "affiche-just-dance-a2",
  size: "A2",
  type: AFFICHE,
  quantity: 24,
  text: "Just Dance",
  comment: null,
};
export const afficheJustDance10x3: Signage = {
  id: "affiche-just-dance-10x3",
  size: "10x3",
  type: AFFICHE,
  quantity: 24,
  text: "Just Dance",
  comment: "fond bleu",
};
export const panneauEscapeGame4x3: Signage = {
  id: "panneau-escape-game-4x3",
  text: "Escape Game",
  quantity: 1,
  size: "4x3",
  type: PANNEAU,
  comment: null,
};
export const bacheBienvenue10m: Signage = {
  id: "bache-bienvenue-10m-par-2m",
  text: "Bienvenue",
  quantity: 1,
  size: "10m par 2m",
  type: BACHE,
  comment: "Pour qu'on nous voit bien",
};

export const nintendoSwitchSupply: ElectricitySupply = {
  id: "nintendo-switch-pc16_prise_classique",
  device: "Nintendo Switch",
  count: 1,
  connection: PC16_Prise_classique,
  power: 100,
  comment: "Pour jouer à Just Dance",
};
export const lumiere: ElectricitySupply = {
  id: "lumiere-p17_16a_tetra",
  connection: P17_16A_TETRA,
  device: "Lumière",
  power: 100,
  count: 3,
  comment: "Ceci est un commentaire",
};
export const enceinte: ElectricitySupply = {
  id: "enceinte-p17_32a_tetra",
  connection: P17_32A_TETRA,
  device: "Enceinte",
  power: 200,
  count: 1,
  comment: null,
};

export const unPlateauDeDance = {
  slug: "plateau-de-dance",
  name: "Plateau de dance",
  quantity: 1,
};
export const uneMultiprise3Prises = {
  slug: "multiprise-3-prises",
  name: "Multiprise 3 prises",
  quantity: 1,
};
export const uneNintendoSwitch = {
  slug: "nintendo-switch",
  name: "Nintendo Switch",
  quantity: 1,
};
export const quinzeVaubans = { slug: "vauban", name: "Vauban", quantity: 30 };
export const deuxMarteaux = { slug: "marteau", name: "Marteau", quantity: 2 };
export const unePriseMurale = {
  slug: "prise-murale",
  name: "Prise murale",
  quantity: 1,
};
export const dixCadenasPompier = {
  slug: "cadenas-pompier",
  name: "Cadenas pompier",
  quantity: 10,
};
export const uneBouilloire = {
  slug: "bouilloire",
  name: "Bouilloire",
  quantity: 1,
};
export const uneMultiprise = {
  slug: "multiprise",
  name: "Multiprise",
  quantity: 1,
};

export const lafarge: Contractor = {
  id: 1,
  firstname: "David",
  lastname: "Lafarge",
  phone: "0304010205",
  email: "david@lafarge.com",
  company: "Lafarge",
  comment: "On ne sait rien de lui",
};
