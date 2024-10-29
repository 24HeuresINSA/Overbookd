<template>
  <div class="volunteer-card">
    <div class="volunteer-card-data" @contextmenu.prevent="openPlanning">
      <div class="info-row">
        <span class="info-row__title">{{ formattedUserInformations }}</span>
        <div class="info-row__icons">
          <v-tooltip location="top">
            <template #activator="activator">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  !volunteer.hasAtLeastOneFriend
                "
                v-bind="activator.props"
                icon="mdi-account-alert"
                size="small"
                color="red"
              />
            </template>
            N'a aucun ami
          </v-tooltip>
          <v-tooltip top>
            <template #activator="activator">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  volunteer.hasFriendAssigned
                "
                v-bind="activator.props"
                icon="mdi-account-check"
                size="small"
                color="green"
              />
            </template>
            Ami déjà assigné sur le créneau
          </v-tooltip>
          <v-tooltip location="top">
            <template #activator="activator">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  volunteer.assignableFriendsIds.length > 0
                "
                v-bind="activator.props"
                icon="mdi-account-group"
                size="small"
              />
            </template>
            Amis disponibles sur le même créneau
          </v-tooltip>
          <v-tooltip location="top" max-width="20rem">
            <template #activator="activator">
              <v-icon
                v-if="volunteer.note"
                v-bind="activator.props"
                icon="mdi-note"
                size="small"
              />
            </template>
            {{ volunteer.note }}
          </v-tooltip>
          <v-tooltip location="top" max-width="20rem">
            <template #activator="activator">
              <v-icon
                v-if="volunteer.comment"
                v-bind="activator.props"
                icon="mdi-comment"
                size="small"
              />
            </template>
            {{ volunteer.comment }}
          </v-tooltip>
          <v-tooltip top>
            <template #activator="activator">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  volunteer.isRequestedOnSamePeriod
                "
                v-bind="activator.props"
                icon="mdi-alert"
                size="small"
                color="orange"
              />
            </template>
            Ce bénévole est demandé sur ce créneau dans une FT non terminée
          </v-tooltip>
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

const openPlanning = (): void => {
  window.open(`${PLANNING_URL}/${props.volunteer.id}`, "_blank");
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
