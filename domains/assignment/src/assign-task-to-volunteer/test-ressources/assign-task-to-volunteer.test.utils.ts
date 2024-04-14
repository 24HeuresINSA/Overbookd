import { ONE_HOUR_IN_MS, Period } from "@overbookd/period";
import { AssignmentBuilder } from "./factory/assignment.builder";
import {
  AssignmentSummaryFactory,
  AssignmentTeamFactory,
} from "./factory/assignment-summary.factory";
import { Volunteer } from "../../volunteer";
import { AssignableVolunteerFactory } from "./factory/assignable-volunteer.factory";

const friday08hto09h = Period.init({
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
});
const friday08h45to09h = Period.init({
  start: new Date("2024-05-17T08:45+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
});
const friday09hto10h = Period.init({
  start: new Date("2024-05-17T09:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
});

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
export const noelAsAvailableVolunteer = AssignableVolunteerFactory.init(noel);
export const leaAsAvailableVolunteer = AssignableVolunteerFactory.init(lea)
  .withAssignments([friday09hto10h], ONE_HOUR_IN_MS)
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
).withTeams([oneHardAssignedAndDemanded.value]);
export const fulfilledAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([oneHardDemanded.value])
  .withSummary(fulfilledAssignmentSummary);

const missingOnePlaizirAssignmentSummary = AssignmentSummaryFactory.init(
  friday08hto09h,
)
  .withTeams([onePlaizirDemanded.value])
  .withAssignableVolunteers(
    availableVolunteersForMissingOnePlaizir.map(({ expected }) => expected),
  );
export const missingOnePlaizirAssignment = AssignmentBuilder.init(
  friday08hto09h,
)
  .withRequestedTeams([onePlaizirDemanded.value])
  .withSummary(missingOnePlaizirAssignmentSummary);

const missingTwoVieuxAssignmentSummary = AssignmentSummaryFactory.init(
  friday08hto09h,
).withTeams([oneHardAssignedAndDemanded.value, twoVieuxDemanded.value]);
export const missingTwoVieuxAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([
    oneHardAssignedAndDemanded.value,
    twoVieuxDemanded.value,
  ])
  .withSummary(missingTwoVieuxAssignmentSummary);

const missingOneHardAndOneBenevoleAssignmentSummary =
  AssignmentSummaryFactory.init(friday08hto09h).withTeams([
    threeHardDemandedAndTwoAssigned.value,
    twoBenevoleDemandedAndOneAssigned.value,
  ]);
export const missingOneHardAndOneBenevoleAssignment = AssignmentBuilder.init(
  friday08hto09h,
)
  .withAssignees([{ as: "hard" }, { as: "hard" }, { as: "benevole" }])
  .withRequestedTeams([threeHardDemanded.value, twoBenevoleDemanded.value])
  .withSummary(missingOneHardAndOneBenevoleAssignmentSummary);
