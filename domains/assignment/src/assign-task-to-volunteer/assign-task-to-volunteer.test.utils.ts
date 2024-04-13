import { AssignmentSummary } from "./assign-task-to-volunteer";
import { AssignmentBuilder } from "./assignment.builder";

export const friday08hto09h = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
};

export const fulfilledAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([{ code: "hard", required: 1 }])
  .build();
export const fulfilledAssignmentSummary: AssignmentSummary = {
  ...friday08hto09h,
  teams: [{ code: "hard", required: 1, count: 1 }],
};

export const missingOnePlaizirAssignment = AssignmentBuilder.init(
  friday08hto09h,
)
  .withRequestedTeams([{ code: "plaizir", required: 1 }])
  .build();
export const missingOnePlaizirAssignmentSummary: AssignmentSummary = {
  ...friday08hto09h,
  teams: [{ code: "plaizir", required: 1, count: 0 }],
};

export const missingTwoVieuxAssignment = AssignmentBuilder.init(friday08hto09h)
  .withAssignees([{ as: "hard" }])
  .withRequestedTeams([
    { code: "hard", required: 1 },
    { code: "vieux", required: 2 },
  ])
  .build();
export const missingTwoVieuxAssignmentSummary: AssignmentSummary = {
  ...friday08hto09h,
  teams: [
    { code: "hard", required: 1, count: 1 },
    { code: "vieux", required: 2, count: 0 },
  ],
};

export const missingOneHardAndOneBenevoleAssignment = AssignmentBuilder.init(
  friday08hto09h,
)
  .withAssignees([{ as: "hard" }, { as: "hard" }, { as: "benevole" }])
  .withRequestedTeams([
    { code: "hard", required: 3 },
    { code: "benevole", required: 2 },
  ])
  .build();
export const missingOneHardAndOneBenevoleAssignmentSummary: AssignmentSummary =
  {
    ...friday08hto09h,
    teams: [
      { code: "hard", required: 3, count: 2 },
      { code: "benevole", required: 2, count: 1 },
    ],
  };
