<template>
  <div class="volunteer-card" @contextmenu.prevent="openCalendar">
    <div class="info-row">
      <span>{{ formattedUserInformations }}</span>
      <div class="info-row__icons">
        <v-icon v-if="volunteer.friendAvailable" small>
          mdi-account-group
        </v-icon>
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
      </div>
    </div>
    <div>
      <TeamIconChip
        v-for="team of sortedVolunteerTeams"
        :key="team"
        :team="team"
      ></TeamIconChip>
    </div>
    <p>{{ assignmentStats }}</p>
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
  height: 75px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  justify-content: space-between;

  &__icons {
    display: flex;
    gap: 5px;
  }
}
</style>
