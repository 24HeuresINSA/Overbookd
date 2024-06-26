<template>
  <div class="volunteer-card">
    <div class="volunteer-card-data" @contextmenu.prevent="openCalendar">
      <div class="info-row">
        <span class="info-row__title">{{ formattedUserInformations }}</span>
        <div class="info-row__icons">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  !volunteer.hasAtLeastOneFriend
                "
                small
                color="red"
                v-bind="attrs"
                v-on="on"
              >
                mdi-account-alert
              </v-icon>
            </template>
            <span>N'a aucun ami</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  volunteer.hasFriendAssigned
                "
                small
                color="green"
                v-bind="attrs"
                v-on="on"
              >
                mdi-account-check
              </v-icon>
            </template>
            <span>Ami déjà assigné sur le créneau</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  volunteer.assignableFriendsIds.length > 0
                "
                small
                v-bind="attrs"
                v-on="on"
              >
                mdi-account-group
              </v-icon>
            </template>
            <span>Amis disponibles sur le même créneau</span>
          </v-tooltip>
          <v-tooltip top max-width="20rem">
            <template #activator="{ on, attrs }">
              <v-icon v-if="volunteer.note" small v-bind="attrs" v-on="on">
                mdi-note
              </v-icon>
            </template>
            <span>{{ volunteer.note }}</span>
          </v-tooltip>
          <v-tooltip top max-width="20rem">
            <template #activator="{ on, attrs }">
              <v-icon v-if="volunteer.comment" small v-bind="attrs" v-on="on">
                mdi-comment
              </v-icon>
            </template>
            <span>{{ volunteer.comment }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="
                  isAssignableVolunteer(volunteer) &&
                  volunteer.isRequestedOnSamePeriod
                "
                small
                color="orange"
                v-bind="attrs"
                v-on="on"
              >
                mdi-alert
              </v-icon>
            </template>
            <span>
              Ce bénévole est demandé sur ce créneau dans une FT non terminée
            </span>
          </v-tooltip>
        </div>
      </div>
      <div>
        <TeamChip
          v-for="team of sortedVolunteerTeams"
          :key="team"
          :team="team"
        ></TeamChip>
      </div>
      <p class="stats-text">{{ assignmentStats }}</p>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts">
import { TaskWithAssignmentsSummary } from "@overbookd/assignment";
import { Duration } from "@overbookd/period";
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import {
  AssignmentVolunteer,
  isAssignableVolunteer,
} from "~/utils/assignment/assignment-volunteer";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import { sortTeamsForAssignment } from "~/utils/sort/sort-teams";
import { formatUsername } from "~/utils/user/user.utils";

export default Vue.extend({
  name: "AssignmentVolunteerResume",
  components: { TeamChip },
  props: {
    volunteer: {
      type: Object as () => AssignmentVolunteer,
      required: true,
    },
  },
  computed: {
    sortedVolunteerTeams(): string[] {
      return sortTeamsForAssignment(this.volunteer.teams);
    },
    formattedUserInformations(): string {
      return `${formatUsername(this.volunteer)} | ${this.volunteer.charisma}`;
    },
    selectedTask(): TaskWithAssignmentsSummary | null {
      return this.$accessor.assignTaskToVolunteer.selectedTask;
    },
    assignmentStats(): string {
      const duration = Duration.ms(this.volunteer.assignmentDuration);
      const displayedTotalDuration = isAssignableVolunteer(this.volunteer)
        ? ` • total: ${Duration.ms(this.volunteer.totalAssignmentDuration).toString()}`
        : "";
      return `${this.category.toLowerCase()}: ${duration.toString()}${displayedTotalDuration}`;
    },
    category(): string {
      if (this.isOrgaTaskMode) return "affecté";
      return this.selectedTask?.category ?? "indéterminé";
    },
    isOrgaTaskMode(): boolean {
      return isOrgaTaskMode(this.$route.path);
    },
  },
  methods: {
    openCalendar() {
      window.open(`/planning/${this.volunteer.id}`, "_blank");
    },
    isAssignableVolunteer,
  },
});
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
