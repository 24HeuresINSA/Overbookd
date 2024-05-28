export const ORGA_TASK = "orga-task";
export const TASK_ORGA = "task-orga";

type AssignmentMode = typeof ORGA_TASK | typeof TASK_ORGA;

function getAssignmentModeFromRoute(url: string): AssignmentMode {
  const mode = url.split("/").at(-1);
  return mode == ORGA_TASK || mode == TASK_ORGA ? mode : ORGA_TASK;
}

export function isOrgaTaskMode(path: string): boolean {
  return getAssignmentModeFromRoute(path) === ORGA_TASK;
}
