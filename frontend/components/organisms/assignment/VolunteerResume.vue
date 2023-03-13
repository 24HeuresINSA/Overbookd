<template>
  <div class="user-card" @contextmenu.prevent="openCalendar">
    <div>
      {{ formattedUserInformations }}
      <v-tooltip v-if="volunteer.comment" top>
        <template #activator="{ on, attrs }">
          <v-icon right small v-bind="attrs" class="comment-icon" v-on="on">
            mdi-comment
          </v-icon>
        </template>
        <span>{{ volunteer.comment }}</span>
      </v-tooltip>
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
import { Team } from "~/utils/models/team";
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
    sortedVolunteerTeams(): Team[] {
      let filteredTeams = this.volunteer.teams.filter(
        (team) => team.code !== "admin" && team.code !== "orga"
      );
      const softIndex = filteredTeams.findIndex((team) => team.code === "soft");
      if (softIndex !== -1) {
        filteredTeams = moveAtFirstIndex(filteredTeams, softIndex);
      }
      const hardIndex = filteredTeams.findIndex((team) => team.code === "hard");
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
}

.comment-icon {
  position: absolute !important;
  top: 0px;
  right: 0px;
}
</style>
