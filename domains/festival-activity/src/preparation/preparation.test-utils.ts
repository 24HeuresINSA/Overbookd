import { InReview } from "../festival-activity";
import { getFactory } from "../festival-activity.factory";
import { friday18hToMonday00h } from "../festival-activity.fake";
import {
  friday12hToFriday14h,
  noel,
  neverEscape,
  panneauEscapeGame4x3,
  bacheBienvenue10m,
  friday11hToFriday15h,
  marteau,
  priseMurale,
  vauban,
  lumiere,
  enceinte,
  videoGameCollectif,
  afficheJustDanceA2,
  afficheJustDance10x3,
  nintendoSwitchSupply,
  saturday11hToSaturday15h,
  plateauDeDance,
  multiprise3Prises,
  nintendoSwitch,
  saturday14hToSaturday18h,
  sunday14hToSunday18h,
  friday12hToMonday00h,
  george,
} from "../festival-activity.fake";

const factory = getFactory();

export const escapeGame = factory
  .draft("Escape Game")
  .asPublic({
    photoLink: "https://www.google.com",
    isFlagship: true,
    categories: ["Sport"],
    timeWindows: [friday12hToFriday14h],
  })
  .withInCharge({
    adherent: noel,
    team: "culture",
    contractors: [neverEscape],
  })
  .withSigna({
    location: "Creux CGU",
    signages: [panneauEscapeGame4x3, bacheBienvenue10m],
  })
  .withSecurity({ specialNeed: "Pas de besoin particulier" })
  .withInquiry({
    timeWindows: [friday11hToFriday15h],
    gears: [marteau],
    electricity: [priseMurale],
    barriers: [{ ...vauban, quantity: 15 }],
  })
  .withSupply({ electricity: [lumiere, enceinte] })
  .build();

export const pcSecurite: InReview = factory
  .inReview("Pc Securite")
  .withGeneral({
    description: "Maintenir l'ordre est indispensable",
    timeWindows: [friday18hToMonday00h],
  })
  .withSecurity({ specialNeed: "Un vigil a l'entree" })
  .build();

export const justDance = factory
  .inReview("Just Dance")
  .withGeneral({
    description: "Viens t'amuser en defiant tes amis en battle de dance",
  })
  .asPublic({
    categories: ["Culture"],
    photoLink: "https://pinterest.com/12345",
    isFlagship: false,
    timeWindows: [friday11hToFriday15h],
  })
  .withInCharge({
    adherent: noel,
    team: "culture",
    contractors: [videoGameCollectif],
  })
  .withSigna({
    location: "Hall de la mde",
    signages: [afficheJustDanceA2, afficheJustDance10x3],
  })
  .withSupply({
    electricity: [nintendoSwitchSupply],
    water: "Une fontaine pour se rafraichir",
  })
  .withInquiry({
    timeWindows: [friday11hToFriday15h, saturday11hToSaturday15h],
    gears: [plateauDeDance],
    electricity: [multiprise3Prises, nintendoSwitch],
  })
  .build();

export const baladeEnPoney = factory
  .inReview("Balade en poney")
  .withGeneral({ description: "Viens faire un tour de campus a dos de poney" })
  .asPublic({
    categories: ["Enfants", "Divertissement"],
    photoLink: "https://pinterest.com/936302",
    isFlagship: false,
    timeWindows: [saturday14hToSaturday18h, sunday14hToSunday18h],
  })
  .withInCharge({ adherent: noel, team: "plaizir" })
  .withSigna({ location: "Pelouse des humas" })
  .withInquiry({
    timeWindows: [saturday14hToSaturday18h],
    barriers: [vauban],
  })
  .build();

export const qgOrga = factory
  .draft("QG Orga")
  .withGeneral({
    description: "Endroit ou tout le monde se retrouve",
    categories: ["Orga", "Benevoles"],
    timeWindows: [friday12hToMonday00h],
  })
  .withInCharge({ adherent: george, team: "beboo" })
  .withSigna({ location: "Agora" })
  .withSupply({ electricity: [lumiere, enceinte] })
  .build();
