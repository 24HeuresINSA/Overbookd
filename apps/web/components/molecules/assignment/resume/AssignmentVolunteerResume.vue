<template>
  <div class="volunteer-card">
    <div class="volunteer-card-data" @contextmenu.prevent="openPlanning">
      <div class="info-row">
        <span class="info-row__title">{{ formattedUserInformations }}</span>
        <div class="info-row__icons">
          <v-icon
            v-if="shouldShowNoFriendIcon"
            v-tooltip:top="'N\'a aucun ami'"
            icon="mdi-account-alert"
            size="small"
            color="red"
          />
          <v-icon
            v-if="shouldShowFriendAssignedIcon"
            v-tooltip:top="'Ami déjà assigné sur le créneau'"
            icon="mdi-account-check"
            size="small"
            color="green"
          />
          <v-icon
            v-if="shouldShowAvailableFriendsIcon"
            v-tooltip:top="'Amis disponibles sur le même créneau'"
            icon="mdi-account-group"
            size="small"
          />
          <v-icon
            v-if="volunteer.note"
            v-tooltip:top="volunteer.note"
            icon="mdi-note"
            size="small"
          />
          <v-icon
            v-if="volunteer.comment"
            v-tooltip:top="volunteer.comment"
            icon="mdi-comment"
            size="small"
          />
          <v-icon
            v-if="shouldShowRequestedOnDraftTaskIcon"
            v-tooltip:top="'Demandé sur une FT non terminée'"
            icon="mdi-alert"
            size="small"
            color="orange"
          />
          <v-icon
            v-if="preferenceAssignmentIcon"
            v-tooltip:top="preferenceAssignmentIcon.toolTipTexte"
            :icon="preferenceAssignmentIcon.iconName"
            size="small"
          />
        </div>
      </div>
      <div>
        <TeamChip
          v-for="team of sortedVolunteerTeams"
          :key="team"
          :team="team"
        />
      </div>
      <p class="stats-text">{{ assignmentStats }}</p>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts" setup>
import type { TaskWithAssignmentsSummary } from "@overbookd/assignment";
import { FRAGMENTED, NO_REST, STACKED } from "@overbookd/preference";
import { SOFT_CODE } from "@overbookd/team-constants";
import { Duration } from "@overbookd/time";
import { buildUserName } from "@overbookd/user";
import { PLANNING_URL } from "@overbookd/web-page";
import {
  type AssignmentVolunteer,
  isAssignableVolunteer,
} from "~/utils/assignment/assignment-volunteer";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import { sortTeamsForAssignment } from "~/utils/sort/sort-teams.utils";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();
const route = useRoute();

const props = defineProps({
  volunteer: {
    type: Object as PropType<AssignmentVolunteer>,
    required: true,
  },
});

const preferenceAssignmentIcon = computed<{
  iconName: string;
  toolTipTexte: string;
} | null>(() => {
  if (!props.volunteer.teams.includes(SOFT_CODE)) return null;
  switch (props.volunteer.preference.assignment) {
    case NO_REST:
      return {
        iconName: "mdi-menu",
        toolTipTexte: "Pas de repos !",
      };
    case STACKED:
      return {
        iconName: "mdi-format-vertical-align-center",
        toolTipTexte: "Des créneaux régroupés",
      };
    case FRAGMENTED:
      return {
        iconName: "mdi-align-vertical-distribute",
        toolTipTexte: "Des créneaux éparpillés",
      };
    default:
      return null;
  }
});

const sortedVolunteerTeams = computed<string[]>(() =>
  sortTeamsForAssignment(props.volunteer.teams),
);
const formattedUserInformations = computed<string>(
  () => `${buildUserName(props.volunteer)} | ${props.volunteer.charisma}`,
);
const selectedTask = computed<TaskWithAssignmentsSummary | null>(
  () => assignTaskToVolunteerStore.selectedTask,
);

const isOrgaTask = computed<boolean>(() => isOrgaTaskMode(route.path));
const category = computed<string>(() => {
  if (isOrgaTask.value) return "affecté";
  return selectedTask.value?.category ?? "indéterminé";
});
const assignmentStats = computed<string>(() => {
  const duration = Duration.ms(props.volunteer.assignmentDuration).toString();
  const displayedTotalDuration = isAssignableVolunteer(props.volunteer)
    ? ` • total: ${duration}`
    : "";
  return `${category.value.toLowerCase()}: ${duration}${displayedTotalDuration}`;
});

const shouldShowNoFriendIcon = computed<boolean>(
  () =>
    isAssignableVolunteer(props.volunteer) &&
    !props.volunteer.hasAtLeastOneFriend,
);
const shouldShowFriendAssignedIcon = computed<boolean>(
  () =>
    isAssignableVolunteer(props.volunteer) && props.volunteer.hasFriendAssigned,
);
const shouldShowAvailableFriendsIcon = computed<boolean>(
  () =>
    isAssignableVolunteer(props.volunteer) &&
    props.volunteer.assignableFriendsIds.length > 0,
);
const shouldShowRequestedOnDraftTaskIcon = computed<boolean>(
  () =>
    isAssignableVolunteer(props.volunteer) &&
    props.volunteer.isRequestedOnSamePeriod,
);

const openPlanning = (): void => {
  window.open(`${PLANNING_URL}/${props.volunteer.id}`);
};
</script>

<style lang="scss" scoped>
.volunteer-card {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column;
}

.volunteer-card-data {
  overflow: hidden;
}

.info-row {
  display: flex;
  justify-content: space-between;

  &__title {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  &__icons {
    display: flex;
    gap: 5px;
  }
}

.stats-text {
  text-transform: capitalize;
  font-size: 0.9rem;
  margin-top: 2px;
  margin-bottom: 4px;
}
</style>
