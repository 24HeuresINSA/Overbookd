<template>
  <div class="volunteer-card">
    <div class="volunteer-card-data">
      <div class="info-row">
        <span class="info-row__title">{{ formattedUserInformations }}</span>
      </div>
      <div class="teams">
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
  name: "VolunteerResumeCalendarHeader",
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
});
</script>

<style lang="scss" scoped>
.volunteer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.volunteer-card-data {
  overflow: hidden;
}

.teams {
  display: flex;
  justify-content: center;
  align-items: center;
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
