<template>
  <div class="user-card" @contextmenu.prevent="openCalendar">
    <div>
      {{ formattedUserInformations }}
      <v-tooltip v-if="user.comment" top>
        <template #activator="{ on, attrs }">
          <v-icon right small v-bind="attrs" class="comment-icon" v-on="on">
            mdi-comment
          </v-icon>
        </template>
        <span>{{ user.comment }}</span>
      </v-tooltip>
    </div>
    <div>
      <MiniUserBadge v-for="team of sortedUserTeams" :key="team" :team="team" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MiniUserBadge from "~/components/atoms/MiniUserBadge.vue";
import { moveAtFirstIndex } from "~/utils/functions/list";
import { CompleteUserWithPermissions } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "UserResume",
  components: { MiniUserBadge },
  props: {
    user: {
      type: Object as () => CompleteUserWithPermissions,
      required: true,
    },
  },
  computed: {
    sortedUserTeams(): string[] {
      let filteredTeams = this.user.team.filter(
        (team) => team !== "admin" && team !== "orga"
      );
      const softIndex = filteredTeams.indexOf("soft");
      if (softIndex !== -1) {
        filteredTeams = moveAtFirstIndex(filteredTeams, softIndex);
      }
      const hardIndex = filteredTeams.indexOf("hard");
      if (hardIndex !== -1) {
        filteredTeams = moveAtFirstIndex(filteredTeams, hardIndex);
      }
      return filteredTeams;
    },
    formattedUserInformations(): string {
      return `${formatUsername(this.user)} | ${this.user.charisma}`;
    },
  },
  methods: {
    openCalendar() {
      window.open(`/calendar/${this.user.id}`, "_blank");
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
