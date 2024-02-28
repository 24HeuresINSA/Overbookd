<template>
  <div>
    <h1>Admission bénévoles</h1>
    <v-data-table
      :headers="headers"
      :items="volunteersToEnroll"
      :items-per-page="30"
    >
      <template #item.registeredAt="{ item }">
        {{ formatDate(item.registeredAt) }}
      </template>

      <template #item.birthdate="{ item }">
        {{ formatDate(item.birthdate) }}
      </template>

      <template #item.teams="{ item }">
        <TeamChip v-for="team of item.teams" :key="team" :team="team" />
      </template>
    </v-data-table>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { EnrollableVolunteer } from "@overbookd/http";
import { defineComponent } from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatLocalDate } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";

type RegistrationsData = {
  headers: Header[];
  selectedVolunteer?: EnrollableVolunteer;
};

export default defineComponent({
  name: "RegistrationsSoft",
  components: { SnackNotificationContainer, TeamChip },
  data: (): RegistrationsData => ({
    headers: [
      { text: "Date d'inscription", value: "registeredAt" },
      { text: "Prénom", value: "firstname" },
      { text: "Nom", value: "lastname" },
      { text: "Charisme", value: "charisma" },
      { text: "Équipes", value: "teams", sortable: false },
      { text: "Date de naissance", value: "birthdate" },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ],
    selectedVolunteer: undefined,
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
  },
});
</script>
