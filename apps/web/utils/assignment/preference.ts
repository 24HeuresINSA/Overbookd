import type { AssignmentPreferenceType } from "@overbookd/preference";

export const assignmentPreferenceLabels: Record<
  AssignmentPreferenceType,
  string
> = {
  NO_PREF: "Pas de préférence",
  STACKED: "Planning regroupé",
  FRAGMENTED: "Planning aéré",
  NO_REST: "JE VEUX UN MAX DE CRÉNEAUX !",
};

export const assignmentPreferenceDetailedLabels: Record<
  AssignmentPreferenceType,
  string
> = {
  NO_PREF: assignmentPreferenceLabels.NO_PREF,
  STACKED: `${assignmentPreferenceLabels.STACKED} (créneaux bénévoles collés et grandes pauses)`,
  FRAGMENTED: `${assignmentPreferenceLabels.FRAGMENTED} (créneaux bénévoles espacés de petites pauses)`,
  NO_REST: `${assignmentPreferenceLabels.NO_REST} (Quand je dors pas, je suis bénévole)`,
};
