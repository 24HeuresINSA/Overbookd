<template>
  <div class="volunteer-card">
    <div class="volunteer-card-data" @contextmenu.prevent="openCalendar">
      <div class="info-row">
        <span class="info-row__title">{{ formattedUserInformations }}</span>
        <div class="info-row__icons">
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
                v-if="volunteer.hasUserRequest"
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
        <TeamIconChip
          v-for="team of sortedVolunteerTeams"
          :key="team"
          :team="team"
        ></TeamIconChip>
      </div>
      <p class="stats-text">{{ assignmentStats }}</p>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamIconChip from "~/components/atoms/TeamIconChip.vue";
import { moveAtFirstIndex } from "~/utils/functions/list";
import { Volunteer } from "~/utils/models/assignment";
import { FtWithTimespan } from "~/utils/models/ftTimespan";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "VolunteerResume",
  components: { TeamIconChip },
  props: {
    volunteer: {
      type: Object as () => Volunteer,
      required: true,
    },
  },
  computed: {
    sortedVolunteerTeams(): string[] {
      let filteredTeams = this.volunteer.teams.filter(
        (team) => team !== "admin" && team !== "orga"
      );
      const softIndex = filteredTeams.findIndex((team) => team === "soft");
      if (softIndex !== -1) {
        filteredTeams = moveAtFirstIndex(filteredTeams, softIndex);
      }
      const hardIndex = filteredTeams.findIndex((team) => team === "hard");
      if (hardIndex !== -1) {
        filteredTeams = moveAtFirstIndex(filteredTeams, hardIndex);
      }
      return filteredTeams;
    },
    formattedUserInformations(): string {
      return `${formatUsername(this.volunteer)} | ${this.volunteer.charisma}`;
    },
    selectedFt(): FtWithTimespan | null {
      return this.$accessor.assignment.selectedFt;
    },
    assignmentStats(): string {
      const counter = this.volunteer.assignments;
      return `Tâches ${this.category.toLowerCase()}: ${counter}`;
    },
    category(): string {
      if (!this.selectedFt) return "affectées";
      return this.selectedFt?.category ?? "indéterminées";
    },
  },
  methods: {
    openCalendar() {
      window.open(`/calendar/${this.volunteer.id}`, "_blank");
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
  font-size: 0.9rem;
  margin-top: 2px;
  margin-bottom: 4px;
}
</style>
