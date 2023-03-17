<template>
  <div class="user-card" @contextmenu.prevent="openCalendar">
    <div class="user-card__info-row">
      <span>{{ formattedUserInformations }}</span>
      <div class="user-card__info-row__icons">
        <v-tooltip v-if="volunteer.comment">
          <template #activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on"> mdi-comment </v-icon>
          </template>
          <span>{{ volunteer.comment }}</span>
        </v-tooltip>
      </div>
    </div>
    <div>
      <MiniUserBadge
        v-for="team of sortedVolunteerTeams"
        :key="team"
        :team="team"
      ></MiniUserBadge>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MiniUserBadge from "~/components/atoms/MiniUserBadge.vue";
import { moveAtFirstIndex } from "~/utils/functions/list";
import { Volunteer } from "~/utils/models/assignment";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "VolunteerResume",
  components: { MiniUserBadge },
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
.user-card {
  height: 60px;
  width: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__info-row {
    display: flex;
    justify-content: space-between;

    &__icons {
      display: flex;
    }
  }
}
</style>
