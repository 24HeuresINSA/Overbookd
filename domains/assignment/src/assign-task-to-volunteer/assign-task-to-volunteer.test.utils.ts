import { Period } from "@overbookd/period";
import { AssignableVolunteer } from "./assign-task-to-volunteer";
import { AssignmentBuilder } from "./assignment.builder";
import {
  AssignmentSummaryFactory,
  AssignmentTeamFactory,
} from "./assignment-summary.factory";

const friday08hto09h = Period.init({
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
});

const noel = {
  id: 1,
  firstname: "Noel",
  lastname: "Ertsemud",
  nickname: "Moto",
  charisma: 1000,
  teams: ["hard", "plaizir"],
};
const availableVolunteersForMissingOnePlaizir: AssignableVolunteer[] = [
  {
    ...noel,
    assignmentDuration: 0,
    hasFriendAssigned: false,
    hasFriendAvailable: false,
    isRequestedOnSamePeriod: false,
  },
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
  .withAssignableVolunteers(availableVolunteersForMissingOnePlaizir);
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
