<template>
  <div
    class="volunteer-card"
    :class="shouldShowStat ? 'volunteer-card--with-stat' : ''"
    @contextmenu.prevent="openCalendar"
  >
    <div class="info-row">
      <span>{{ formattedUserInformations }}</span>
      <div class="info-row__icons">
        <v-tooltip v-if="volunteer.comment">
          <template #activator="{ on, attrs }">
            <v-icon small v-bind="attrs" v-on="on"> mdi-comment </v-icon>
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
    <p v-show="shouldShowStat">{{ categoryStatText }}</p>
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
    shouldShowStat(): boolean {
      return Boolean(this.selectedFt !== null && this.selectedFt?.category);
    },
    categoryStatText(): string {
      return `${this.selectedFt?.category}: ${this.volunteer.categoryTaskCount}`;
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

  &--with-stat {
    height: 75px;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;

  &__icons {
    display: flex;
  }
}
</style>
