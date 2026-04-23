<template>
  <div class="icons">
    <v-icon
      v-if="!volunteer.friendCount.volunteerCount"
      v-tooltip:top="getNoFriendLabel(volunteer.friendCount.candidateCount)"
      icon="mdi-account-alert"
      :aria-label="getNoFriendLabel(volunteer.friendCount.candidateCount)"
      size="small"
      :color="volunteer.friendCount.candidateCount ? 'warning' : 'error'"
    />
    <v-icon
      v-if="shouldShowFriendAssignedIcon"
      v-tooltip:top="'Ami·e·s déjà assigné·e·s sur le créneau'"
      icon="mdi-account-check"
      aria-label="Ami·e·s déjà assigné·e·s sur le créneau"
      size="small"
      color="success"
    />
    <v-icon
      v-if="shouldShowAvailableFriendsIcon"
      v-tooltip:top="'Ami·e·s disponibles sur le même créneau'"
      icon="mdi-account-group"
      aria-label="Ami·e·s disponibles sur le même créneau"
      size="small"
    />
    <v-icon
      v-if="volunteer.note"
      v-tooltip:top="volunteer.note"
      icon="mdi-note"
      :aria-label="volunteer.note"
      size="small"
    />
    <v-icon
      v-if="volunteer.comment"
      v-tooltip:top="volunteer.comment"
      icon="mdi-comment"
      :aria-label="volunteer.comment"
      size="small"
    />
    <v-icon
      v-if="shouldShowRequestedOnDraftTaskIcon"
      v-tooltip:top="'Demandé sur une FT non terminée'"
      icon="mdi-alert"
      aria-label="Demandé sur une FT non terminée"
      size="small"
      color="warning"
    />
    <v-icon
      v-if="preferenceAssignmentIcon"
      v-tooltip:top="preferenceAssignmentIcon.label"
      :icon="preferenceAssignmentIcon.icon"
      :aria-label="preferenceAssignmentIcon.label"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import { FRAGMENTED, NO_REST, STACKED } from "@overbookd/preference";
import { SOFT } from "@overbookd/team-constants";
import {
  isAssignableVolunteer,
  type AssignmentVolunteer,
} from "~/utils/assignment/assignment-volunteer";

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<AssignmentVolunteer>,
    required: true,
  },
});

type AssignmentPreferenceIcon = { icon: string; label: string };
const preferenceAssignmentIcon = computed<AssignmentPreferenceIcon | null>(
  () => {
    if (!volunteer.teams.includes(SOFT)) return null;
    switch (volunteer.assignmentPreference) {
      case NO_REST:
        return {
          icon: "mdi-menu",
          label: "Pas de repos !",
        };
      case STACKED:
        return {
          icon: "mdi-format-vertical-align-center",
          label: "Des créneaux régroupés",
        };
      case FRAGMENTED:
        return {
          icon: "mdi-align-vertical-distribute",
          label: "Des créneaux éparpillés",
        };
      default:
        return null;
    }
  },
);

const getNoFriendLabel = (candidateFriendCount: number): string => {
  const noFriendsLabel = "N'a aucun·e ami·e";
  if (!candidateFriendCount) return noFriendsLabel;
  return `${noFriendsLabel} bénévole mais a ${candidateFriendCount} ami·e${candidateFriendCount !== 1 ? "·s" : ""} candidat${candidateFriendCount !== 1 ? "s" : ""} `;
};

const shouldShowFriendAssignedIcon = computed<boolean>(
  () => isAssignableVolunteer(volunteer) && volunteer.hasFriendAssigned,
);
const shouldShowAvailableFriendsIcon = computed<boolean>(
  () =>
    isAssignableVolunteer(volunteer) &&
    volunteer.assignableFriendsIds.length > 0,
);
const shouldShowRequestedOnDraftTaskIcon = computed<boolean>(
  () => isAssignableVolunteer(volunteer) && volunteer.isRequestedOnSamePeriod,
);
</script>

<style>
.icons {
  display: flex;
  gap: 5px;
}
</style>
