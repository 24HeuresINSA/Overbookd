import { Reviewable } from "../festival-activity";
import { getFactory } from "../festival-activity.factory";
import {
  friday18hToMonday00h,
  lafarge,
  uneBouilloire,
  pelouseHumas,
  agora,
  creuxCgu,
} from "../festival-activity.fake";
import {
  friday12hToFriday14h,
  noel,
  neverEscape,
  panneauEscapeGame4x3,
  bacheBienvenue10m,
  friday11hToFriday15h,
  deuxMarteaux,
  unePriseMurale,
  quinzeVaubans,
  lumiere,
  enceinte,
  videoGameCollectif,
  afficheJustDanceA2,
  afficheJustDance10x3,
  nintendoSwitchSupply,
  saturday11hToSaturday15h,
  unPlateauDeDance,
  uneMultiprise3Prises,
  uneNintendoSwitch,
  saturday14hToSaturday18h,
  sunday14hToSunday18h,
  friday12hToMonday00h,
  george,
} from "../festival-activity.fake";
import { APPROVED } from "../../common/action";

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
    location: creuxCgu,
    signages: [panneauEscapeGame4x3, bacheBienvenue10m],
  })
  .withSecurity({ specialNeed: "Pas de besoin particulier" })
  .withInquiry({
    timeWindows: [friday11hToFriday15h],
    gears: [deuxMarteaux],
    electricity: [unePriseMurale],
    barriers: [{ ...quinzeVaubans, quantity: 15 }],
  })
  .withSupply({ electricity: [lumiere, enceinte] })
  .build();

export const pcSecurite: Reviewable = factory
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
    location: agora,
    signages: [afficheJustDanceA2, afficheJustDance10x3],
  })
  .withSupply({
    electricity: [nintendoSwitchSupply],
    water: "Une fontaine pour se rafraichir",
  })
  .withInquiry({
    timeWindows: [friday11hToFriday15h, saturday11hToSaturday15h],
    gears: [unPlateauDeDance],
    electricity: [uneMultiprise3Prises, uneNintendoSwitch],
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
  .withSigna({ location: pelouseHumas, signages: [bacheBienvenue10m] })
  .withInquiry({
    timeWindows: [saturday14hToSaturday18h],
    barriers: [quinzeVaubans],
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
  .withSigna({ location: agora })
  .withSupply({ electricity: [lumiere, enceinte] })
  .build();

export const approvedByHumain = factory
  .inReview("Validée par les humain")
  .withGeneral({
    timeWindows: [friday12hToFriday14h, saturday11hToSaturday15h],
  })
  .withInCharge({ contractors: [lafarge] })
  .withReviews({ humain: APPROVED })
  .build();

export const publicApprovedByHumain = factory
  .inReview("Publique validée par les humain")
  .asPublic()
  .withGeneral({
    timeWindows: [friday12hToFriday14h, saturday11hToSaturday15h],
  })
  .withInCharge({ contractors: [lafarge] })
  .withReviews({ humain: APPROVED })
  .build();

export const approvedByCommunication = factory
  .inReview("Validée par l'équipe communication")
  .asPublic()
  .withGeneral({
    timeWindows: [friday12hToFriday14h, saturday11hToSaturday15h],
  })
  .withReviews({ communication: APPROVED })
  .build();

export const validatedBySecu = factory
  .inReview("Validée par la sécu")
  .withSecurity({ specialNeed: "Une armée d'AS (au moins 1000!)" })
  .withReviews({ secu: APPROVED })
  .build();

export const approvedBySigna = factory
  .inReview("Validée par la signa")
  .withSigna({
    location: pelouseHumas,
    signages: [afficheJustDanceA2, afficheJustDance10x3],
  })
  .withReviews({ signa: APPROVED })
  .build();

export const approvedByElec = factory
  .inReview("Validée par la log elec")
  .withSupply({ electricity: [lumiere, enceinte], water: "robinet d'eau" })
  .withInquiry({
    timeWindows: [sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [uneBouilloire, deuxMarteaux],
    barriers: [quinzeVaubans],
  })
  .withReviews({ elec: APPROVED })
  .build();

export const approvedByElecWithoutRequests = factory
  .inReview("Validée par la log elec sans demandes")
  .withSupply({ electricity: [lumiere, enceinte], water: "robinet d'eau" })
  .withInquiry({
    timeWindows: [friday12hToFriday14h, sunday14hToSunday18h],
    electricity: [],
    gears: [uneBouilloire, deuxMarteaux],
    barriers: [quinzeVaubans],
  })
  .withReviews({ elec: APPROVED })
  .build();

export const approvedByBarrieres = factory
  .inReview("Validée par les barrieres")
  .withInquiry({
    timeWindows: [sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [uneBouilloire, deuxMarteaux],
    barriers: [quinzeVaubans],
  })
  .withReviews({ barrieres: APPROVED })
  .build();

export const approvedByBarrieresWithoutRequests = factory
  .inReview("Validée par les barrieres sans demandes")
  .withInquiry({
    timeWindows: [friday12hToFriday14h, sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [uneBouilloire, deuxMarteaux],
    barriers: [],
  })
  .withReviews({ barrieres: APPROVED })
  .build();

export const approvedByMatos = factory
  .inReview("Validée par la log matos")
  .withInquiry({
    timeWindows: [sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [uneBouilloire, deuxMarteaux],
    barriers: [quinzeVaubans],
  })
  .withReviews({ matos: APPROVED })
  .build();

export const approvedByMatosWithoutRequests = factory
  .inReview("Validée par la log sans demandes")
  .withInquiry({
    timeWindows: [friday12hToFriday14h, sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [],
    barriers: [quinzeVaubans],
  })
  .withReviews({ matos: APPROVED })
  .build();

export const approvedByMatosAndBarrieres = factory
  .inReview("Validée par la log matos et les barrieres")
  .withInquiry({
    timeWindows: [sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [uneBouilloire, deuxMarteaux],
    barriers: [quinzeVaubans],
  })
  .withReviews({ matos: APPROVED, barrieres: APPROVED })
  .build();

export const approvedByMatosAndBarrieresWithoutRequest = factory
  .inReview("Validée par la log matos et les barrieres sans demandes")
  .withInquiry({
    timeWindows: [friday12hToFriday14h, sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [],
    barriers: [],
  })
  .withReviews({ matos: APPROVED, barrieres: APPROVED })
  .build();

export const approvedByAllInquiryOwners = factory
  .inReview("Validée par la log matos, les barrieres et la log elec")
  .withInquiry({
    timeWindows: [sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
    gears: [uneBouilloire, deuxMarteaux],
    barriers: [quinzeVaubans],
  })
  .withReviews({ matos: APPROVED, barrieres: APPROVED, elec: APPROVED })
  .build();

export const approvedByAllInquiryOwnersWithoutRequest = factory
  .inReview(
    "Validée par la log matos, les barrieres et la log elec sans demandes",
  )
  .withInquiry({
    timeWindows: [],
    electricity: [],
    gears: [],
    barriers: [],
  })
  .withReviews({ matos: APPROVED, barrieres: APPROVED, elec: APPROVED })
  .build();
