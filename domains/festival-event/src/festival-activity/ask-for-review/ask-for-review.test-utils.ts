import { Draft } from "../festival-activity";
import { getFactory } from "../festival-activity.factory";
import {
  friday09hToMonday08h,
  saturday19hToSunday01h,
  robocop,
  dixCadenasPompier,
  uneBouilloire,
  faker,
  uneMultiprise,
  agora,
  local24h,
  george,
} from "../festival-activity.fake";
import { REVIEWING } from "../../common/review";
import { APPROVED, REJECTED } from "../../common/action";

const factory = getFactory();

export const pcSecurite = factory
  .draft("PC Securite")
  .withGeneral({ description: "Tour de guet" })
  .withInCharge({ adherent: robocop, team: "secu" })
  .withSigna({ location: local24h })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [friday09hToMonday08h],
    gears: [dixCadenasPompier, uneBouilloire],
  })
  .build();

export const finaleEsport = factory
  .draft("Finale esport")
  .withGeneral({
    description:
      "Après une année de championnat de légende venez assister à la conclusion de cette saison !",
  })
  .asPublic({
    categories: ["sport"],
    photoLink:
      "https://tse1.mm.bing.net/th?id=OIP.Gic1SK5Di5WzX5l_Y2bQtAHaEK&pid=Api",
    isFlagship: true,
    timeWindows: [saturday19hToSunday01h],
  })
  .withInCharge({ adherent: faker, team: "plaizir" })
  .withSigna({ location: agora })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [saturday19hToSunday01h],
    gears: [uneMultiprise],
  })
  .build();

export const justCreated: Draft = factory.draft("test").build();

export const internalWithoutDescription = factory
  .draft("Internal without description")
  .withGeneral({ description: null })
  .withInCharge({ adherent: robocop, team: "secu" })
  .withSigna({ location: local24h })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [friday09hToMonday08h],
    gears: [dixCadenasPompier, uneBouilloire],
  })
  .build();

export const publicWithoutPhoto = factory
  .draft("Finale esport without photo")
  .asPublic({
    categories: ["sport"],
    isFlagship: true,
    timeWindows: [saturday19hToSunday01h],
  })
  .withGeneral({ photoLink: null })
  .withInCharge({ adherent: faker, team: "plaizir" })
  .withSigna({ location: agora })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [saturday19hToSunday01h],
    gears: [uneMultiprise],
  })
  .build();

export const publicWithoutCategory = factory
  .draft("Finale esport without category")
  .asPublic({
    photoLink:
      "https://tse1.mm.bing.net/th?id=OIP.Gic1SK5Di5WzX5l_Y2bQtAHaEK&pid=Api",
    isFlagship: true,
    timeWindows: [saturday19hToSunday01h],
  })
  .withGeneral({ categories: [] })
  .withInCharge({ adherent: faker, team: "plaizir" })
  .withSigna({ location: agora })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [saturday19hToSunday01h],
    gears: [uneMultiprise],
  })
  .build();

export const publicWithoutTimeWindows = factory
  .draft("Finale esport without time windows")
  .asPublic({
    categories: ["sport"],
    photoLink:
      "https://tse1.mm.bing.net/th?id=OIP.Gic1SK5Di5WzX5l_Y2bQtAHaEK&pid=Api",
    isFlagship: true,
    timeWindows: [saturday19hToSunday01h],
  })
  .withGeneral({ timeWindows: [] })
  .withInCharge({ adherent: faker, team: "plaizir" })
  .withSigna({ location: agora })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [saturday19hToSunday01h],
    gears: [uneMultiprise],
  })
  .build();

export const internalWithoutTeamInCharge = factory
  .draft("PC Securite without team")
  .withGeneral({ description: "Tour de guet" })
  .withInCharge({ adherent: robocop, team: null })
  .withSigna({ location: local24h })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [friday09hToMonday08h],
    gears: [dixCadenasPompier, uneBouilloire],
  })
  .build();

export const internalWithoutLocation = factory
  .draft("PC Securite without location")
  .withGeneral({ description: "Tour de guet" })
  .withInCharge({ adherent: robocop, team: "secu" })
  .withSigna({ location: null })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [friday09hToMonday08h],
    gears: [dixCadenasPompier, uneBouilloire],
  })
  .build();

export const internalWithoutInquiries = factory
  .draft("PC Securite without inquiry requests")
  .withGeneral({ description: "Tour de guet" })
  .withInCharge({ adherent: robocop, team: "secu" })
  .withSigna({ location: local24h })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [friday09hToMonday08h],
    gears: [],
  })
  .build();

export const internalWithoutInquiryTimeWindows = factory
  .draft("PC Securite without inquiry time windows")
  .withGeneral({ description: "Tour de guet" })
  .withInCharge({ adherent: robocop, team: "secu" })
  .withSigna({ location: local24h })
  .withSecurity({ specialNeed: "Une armee d'AS super malin" })
  .withInquiry({
    timeWindows: [],
    gears: [dixCadenasPompier, uneBouilloire],
  })
  .build();

export const escapeGame = factory
  .refused("Escape Game")
  .asPublic()
  .withReviews({
    communication: REJECTED,
    secu: REJECTED,
    humain: REJECTED,
    signa: APPROVED,
    elec: REVIEWING,
    matos: REVIEWING,
    barrieres: REVIEWING,
  })
  .build();

export const bubbleFoot = factory
  .refused("BubbleFoot")
  .withInCharge({ adherent: george })
  .asPublic()
  .withReviews({
    communication: APPROVED,
    secu: APPROVED,
    humain: APPROVED,
    signa: REVIEWING,
    elec: REJECTED,
    matos: REVIEWING,
    barrieres: REJECTED,
  })
  .build();
