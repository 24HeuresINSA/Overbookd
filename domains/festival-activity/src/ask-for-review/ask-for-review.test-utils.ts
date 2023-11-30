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
} from "../festival-activity.fake";

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

export const internalWithoutDescription = {
  ...pcSecurite,
  id: 4,
  general: { ...pcSecurite.general, description: null },
};

export const publicWithoutPhoto = {
  ...finaleEsport,
  id: 5,
  general: { ...finaleEsport.general, photoLink: null },
};

export const publicWithoutCategory = {
  ...finaleEsport,
  id: 6,
  general: { ...finaleEsport.general, categories: [] },
};

export const publicWithoutTimeWindows = {
  ...finaleEsport,
  id: 7,
  general: { ...finaleEsport.general, timeWindows: [] },
};

export const internalWithoutTeamInCharge = {
  ...pcSecurite,
  id: 8,
  inCharge: { ...pcSecurite.inCharge, team: null },
};

export const internalWithoutLocation = {
  ...pcSecurite,
  id: 9,
  signa: { ...pcSecurite.signa, location: null },
};

export const internalWithoutInquiries = {
  ...pcSecurite,
  id: 10,
  inquiry: { ...pcSecurite.inquiry, gears: [] },
};

export const internalWithoutInquiryTimeWindows = {
  ...pcSecurite,
  id: 11,
  inquiry: { ...pcSecurite.inquiry, timeWindows: [] },
};
