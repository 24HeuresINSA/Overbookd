import { AssignmentSummary } from "./assign-task-to-volunteer";
import { AssignmentBuilder } from "./assignment.builder";

const friday08hto09h = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
};

export const fulfilledAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([{ code: "hard", demands: 1 }])
  .build();
export const fulfilledAssignmentSummary: AssignmentSummary = {
  ...friday08hto09h,
  teams: [{ code: "hard", demands: 1, assigned: 1 }],
};

export const missingOnePlaizirAssignment = AssignmentBuilder.init(
  friday08hto09h,
)
  .withRequestedTeams([{ code: "plaizir", demands: 1 }])
  .build();
export const missingOnePlaizirAssignmentSummary: AssignmentSummary = {
  ...friday08hto09h,
  teams: [{ code: "plaizir", demands: 1, assigned: 0 }],
};

export const missingTwoVieuxAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([
    { code: "hard", demands: 1 },
    { code: "vieux", demands: 2 },
  ])
  .build();
export const missingTwoVieuxAssignmentSummary: AssignmentSummary = {
  ...friday08hto09h,
  teams: [
    { code: "hard", demands: 1, assigned: 1 },
    { code: "vieux", demands: 2, assigned: 0 },
  ],
};

export const missingOneHardAndOneBenevoleAssignment = AssignmentBuilder.init(
  friday08hto09h,
)
  .withAssignees([{ as: "hard" }, { as: "hard" }, { as: "benevole" }])
  .withRequestedTeams([
    { code: "hard", demands: 3 },
    { code: "benevole", demands: 2 },
  ])
  .build();
export const missingOneHardAndOneBenevoleAssignmentSummary: AssignmentSummary =
  {
    ...friday08hto09h,
    teams: [
      { code: "hard", demands: 3, assigned: 2 },
      { code: "benevole", demands: 2, assigned: 1 },
    ],
  };
