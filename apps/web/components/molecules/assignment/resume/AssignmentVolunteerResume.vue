<template>
  <div class="volunteer-card">
    <div class="volunteer-card-data" @contextmenu.prevent="openCalendar">
      <div class="info-row">
        <span class="info-row__title">{{ formattedUserInformations }}</span>
        <div class="info-row__icons">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="volunteer.hasFriendAssigned"
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
                v-if="volunteer.friendAvailable"
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
              <v-icon v-if="volunteer.comment" small v-bind="attrs" v-on="on">
                mdi-comment
              </v-icon>
            </template>
            <span>{{ volunteer.comment }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                v-if="volunteer.isRequestedOnSamePeriod"
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
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Duration } from "~/utils/date/duration";
import { Volunteer } from "~/utils/models/assignment";
import { FtWithTimeSpan } from "~/utils/models/ftTimeSpan";
import { sortTeamsForAssignment } from "~/utils/models/team";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "AssignmentVolunteerResume",
  components: { TeamChip },
  props: {
    volunteer: {
      type: Object as () => Volunteer,
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
    selectedFt(): FtWithTimeSpan | null {
      return this.$accessor.assignment.selectedFt;
    },
    assignmentStats(): string {
      const duration = Duration.fromMilliseconds(
        this.volunteer.assignmentDuration
      );
      return `${this.category.toLowerCase()}: ${duration.toString()}`;
    },
    category(): string {
      if (!this.selectedFt) return "affecté";
      return this.selectedFt?.category ?? "indéterminé";
    },
  },
  methods: {
    openCalendar() {
      window.open(`/planning/${this.volunteer.id}`, "_blank");
    },
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
