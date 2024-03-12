<template>
  <div>
    <h1>Admission bénévoles</h1>
    <v-data-table
      :headers="headers"
      :items="volunteersToEnroll"
      :expanded.sync="displayedVolunteers"
      :items-per-page="30"
      show-expand
      @click:row="openOrCloseVolunteerDetails"
    >
      <template #item.registeredAt="{ item }">
        {{ formatDate(item.registeredAt) }}
      </template>

      <template #item.name="{ item }">
        {{ formatUserNameWithNickname(item) }}
      </template>

      <template #item.teams="{ item }">
        <TeamChip v-for="team of item.teams" :key="team" :team="team" />
      </template>

      <template #item.action="{ item }">
        <v-btn color="success" small @click="enroll(item)">
          <v-icon left> mdi-check </v-icon>
          Enrôler
        </v-btn>
      </template>

      <template #expanded-item="{ item }">
        <td :colspan="headers.length">
          <VolunteerDetails :volunteer="item" />
        </td>
      </template>
    </v-data-table>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EnrollableVolunteer } from "@overbookd/http";
import { removeItemAtIndex } from "@overbookd/list";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatLocalDate } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import VolunteerDetails from "~/components/molecules/registration/VolunteerDetails.vue";

type RegistrationsData = {
  headers: Header[];
  displayedVolunteers: EnrollableVolunteer[];
};

export default defineComponent({
  name: "RegistrationsSoft",
  components: { SnackNotificationContainer, TeamChip, VolunteerDetails },
  data: (): RegistrationsData => ({
    headers: [
      { text: "Inscription", value: "registeredAt" },
      { text: "Nom", value: "name" },
      { text: "Charisme", value: "charisma" },
      { text: "Équipes", value: "teams", sortable: false },
      { text: "Action", value: "action", sortable: false },
      { text: "", value: "data-table-expand", sortable: false },
    ],
    displayedVolunteers: [],
  }),
  head: () => ({
    title: "Admission bénévoles",
  }),
  computed: {
    volunteersToEnroll(): EnrollableVolunteer[] {
      return this.$accessor.registration.volunteers;
    },
  },
  mounted() {
    this.$accessor.registration.getVolunteers();
  },
  methods: {
    formatDate(date: Date): string {
      return formatLocalDate(date);
    },
    openOrCloseVolunteerDetails(volunteer: EnrollableVolunteer) {
      const volunteerIndex = this.displayedVolunteers.findIndex(
        ({ id }) => id === volunteer.id,
      );
      const dontDisplayDetailsYet = volunteerIndex === -1;
      if (dontDisplayDetailsYet) {
        this.displayedVolunteers = [...this.displayedVolunteers, volunteer];
        return;
      }
      this.displayedVolunteers = removeItemAtIndex(
        this.displayedVolunteers,
        volunteerIndex,
      );
    },
    enroll(volunteer: EnrollableVolunteer) {
      this.$accessor.registration.enrollNewVolunteers([volunteer]);
    },
    formatUserNameWithNickname,
  },
});
</script>
