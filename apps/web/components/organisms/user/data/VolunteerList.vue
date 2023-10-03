<template>
  <v-data-table
    :headers="headers"
    :items="volunteers"
    class="elevation-1"
    :items-per-page="20"
  >
    <template #item.firstname="{ item }">
      {{ formatVolunteerName(item) }}
    </template>

    <template #item.teams="{ item }">
      <div class="team-list">
        <TeamChip
          v-for="team of item.teams"
          :key="team"
          :team="team"
          with-name
          clickable
          @click="propagateClickedTeam"
        />
      </div>
    </template>

    <template #item.actions="{ item }">
      <div class="list-actions">
        <v-btn icon small @click="openInformationDialog(item)">
          <v-icon small>mdi-information-outline</v-icon>
        </v-btn>

        <v-btn icon small :href="getPhoneLink(item.phone)">
          <v-icon small>mdi-phone</v-icon>
        </v-btn>

        <v-btn icon small :href="`mailto:${item.email}`">
          <v-icon small>mdi-email</v-icon>
        </v-btn>

        <v-btn icon small @click="openCalendar(item.id)">
          <v-icon small>mdi-calendar</v-icon>
        </v-btn>
      </div>
    </template>

    <template #no-data> Aucun bénévole trouvé </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { UserPersonnalData } from "@overbookd/user";
import { Header } from "~/utils/models/data-table.model";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
} from "~/utils/user/user.utils";
import { Team } from "~/utils/models/team.model";

interface VolunteerListData {
  headers: Header[];
}

export default Vue.extend({
  name: "VolunteerInformation",
  components: { TeamChip },

  props: {
    volunteers: {
      type: Array as () => UserPersonnalData[],
      required: true,
    },
  },

  data: (): VolunteerListData => ({
    headers: [
      { text: "Prénom Nom (Surnom)", value: "firstname" },
      { text: "Equipes", value: "teams", sortable: false },
      { text: "Charisme", value: "charisma" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),

  methods: {
    openInformationDialog(volunteer: UserPersonnalData) {
      this.$accessor.user.setSelectedUser(volunteer);
      this.$emit("open-dialog");
    },

    openCalendar(volunteerId: number) {
      window.open(`/planning/${volunteerId}`, "_blank");
    },

    getPhoneLink(phone: string) {
      return formatPhoneLink(phone);
    },

    formatVolunteerName(volunteer: UserPersonnalData) {
      return formatUserNameWithNickname(volunteer);
    },

    propagateClickedTeam(team: Team) {
      this.$emit("click:team", team);
    },
  },
});
</script>

<style lang="scss" scoped>
.list-actions {
  @media screen and (max-width: $mobile-max-width) {
    display: flex;
    gap: 1em;
  }
}

.team-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
