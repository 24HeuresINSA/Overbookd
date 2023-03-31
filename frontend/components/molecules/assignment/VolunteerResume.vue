<template>
  <div class="volunteer-card" @contextmenu.prevent="openCalendar">
    <div class="volunteer-card__info-row">
      <span>{{ formattedUserInformations }}</span>
      <div class="icons">
        <v-tooltip v-if="volunteer.comment">
          <template #activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on"> mdi-comment </v-icon>
          </template>
          <span>{{ volunteer.comment }}</span>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/TeamChip.vue";
import { moveAtFirstIndex } from "~/utils/functions/list";
import { Volunteer } from "~/utils/models/assignment";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "VolunteerResume",
  components: { TeamChip },
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
  height: 60px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__info-row {
    display: flex;
    justify-content: space-between;

    .icons {
      display: flex;
    }
  }
}
</style>
