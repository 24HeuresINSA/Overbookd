import { ONE_HOUR_IN_MS, Period } from "@overbookd/period";
import { AssignmentBuilder } from "./factory/assignment.builder";
import {
  AssignmentSummaryFactory,
  AssignmentTeamFactory,
} from "./factory/assignment-summary.factory";
import { Volunteer } from "../../volunteer";
import {
  AssignableVolunteerFactory,
  MaybeCategory,
} from "./factory/assignable-volunteer.factory";
import { BAR } from "@overbookd/festival-event-constants";

const friday07hto10h = Period.init({
  start: new Date("2024-05-17T07:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
});
const friday08hto09h = Period.init({
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
});
const friday08h45to09h = Period.init({
  start: new Date("2024-05-17T08:45+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
});
export const friday09hto10h = Period.init({
  start: new Date("2024-05-17T09:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
});
const friday09hto10hBarAssignment = {
  start: friday09hto10h.start,
  end: friday09hto10h.end,
  category: BAR,
} as const;

const noel: Volunteer = {
  id: 1,
  firstname: "Noel",
  lastname: "Ertsemud",
  nickname: "Moto",
  charisma: 1000,
  teams: ["hard", "plaizir"],
};
const lea: Volunteer = {
  id: 2,
  firstname: "Lea",
  lastname: "Mauyno",
  nickname: "Shogosse",
  charisma: 1,
  teams: ["vieux", "benevole"],
  comment: "Je suis une bénévole de longue date",
  note: "Elle est vraiment très vieille",
};

const defaultAssignmentDurations: Record<MaybeCategory, number> = {
  BAR: 0,
  FUN: 0,
  MANUTENTION: 0,
  RELOU: 0,
  STATIQUE: 0,
  undefined: 0,
};

export const noelAsAvailableVolunteer = AssignableVolunteerFactory.init(noel);
export const leaAsAvailableVolunteer = AssignableVolunteerFactory.init(lea)
  .withAssignments([friday09hto10hBarAssignment], {
    ...defaultAssignmentDurations,
    BAR: ONE_HOUR_IN_MS,
  })
  .withRequests([friday08h45to09h], true);

const availableVolunteersForMissingOnePlaizir: AssignableVolunteerFactory[] = [
  noelAsAvailableVolunteer,
];

const oneHardDemanded = AssignmentTeamFactory.init().withCode("hard");
const oneHardAssignedAndDemanded = oneHardDemanded.withAssigned(1);
const onePlaizirDemanded = AssignmentTeamFactory.init().withCode("plaizir");
const twoVieuxDemanded = AssignmentTeamFactory.init()
  .withCode("vieux")
  .withDemands(2);
const threeHardDemanded = AssignmentTeamFactory.init()
  .withCode("hard")
  .withDemands(3);
const twoBenevoleDemanded = AssignmentTeamFactory.init()
  .withCode("benevole")
  .withDemands(2);
const threeHardDemandedAndTwoAssigned = threeHardDemanded.withAssigned(2);
const twoBenevoleDemandedAndOneAssigned = twoBenevoleDemanded.withAssigned(1);

const fulfilledAssignmentSummary = AssignmentSummaryFactory.init(
  friday08hto09h,
  friday07hto10h.id,
).withTeams([oneHardAssignedAndDemanded.team]);
export const fulfilledAssignment = AssignmentBuilder.init(
  friday08hto09h,
  friday07hto10h.id,
)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([oneHardDemanded.team])
  .withSummary(fulfilledAssignmentSummary);

const missingOnePlaizirAssignmentSummary = AssignmentSummaryFactory.init(
  friday08hto09h,
  friday07hto10h.id,
)
  .withTeams([onePlaizirDemanded.team])
  .withAssignableVolunteers(
    availableVolunteersForMissingOnePlaizir.map(({ expected }) => expected.BAR),
  );
export const missingOnePlaizirAssignment = AssignmentBuilder.init(
  friday08hto09h,
  friday07hto10h.id,
)
  .withRequestedTeams([onePlaizirDemanded.team])
  .withSummary(missingOnePlaizirAssignmentSummary);

const missingTwoVieuxAssignmentSummary = AssignmentSummaryFactory.init(
  friday08hto09h,
  friday07hto10h.id,
).withTeams([oneHardAssignedAndDemanded.team, twoVieuxDemanded.team]);
export const missingTwoVieuxAssignment = AssignmentBuilder.init(
  friday08hto09h,
  friday07hto10h.id,
)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([oneHardAssignedAndDemanded.team, twoVieuxDemanded.team])
  .withSummary(missingTwoVieuxAssignmentSummary);

const missingOneHardAndOneBenevoleAssignmentSummary =
  AssignmentSummaryFactory.init(friday08hto09h, friday07hto10h.id).withTeams([
    threeHardDemandedAndTwoAssigned.team,
    twoBenevoleDemandedAndOneAssigned.team,
  ]);
export const missingOneHardAndOneBenevoleAssignment = AssignmentBuilder.init(
  friday08hto09h,
  friday07hto10h.id,
)
  .withAssignees([{ as: "hard" }, { as: "hard" }, { as: "benevole" }])
  .withRequestedTeams([threeHardDemanded.team, twoBenevoleDemanded.team])
  .withSummary(missingOneHardAndOneBenevoleAssignmentSummary);
