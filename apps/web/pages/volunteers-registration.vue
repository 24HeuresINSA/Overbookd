<template>
  <div>
    <h1>Admission bénévoles</h1>
    <v-data-table
      :headers="headers"
      :items="volunteersToEnroll"
      :items-per-page="30"
    ></v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VolunteersRegistration",
  data() {
    return {
      headers: [
        { text: "Prénom", value: "firstname" },
        { text: "Nom", value: "lastname" },
        { text: "Charisme", value: "charisma" },
        { text: "Date d'inscription", value: "registeredAt" },
        { text: "Équipes", value: "teams", sortable: false },
        { text: "Action", value: "action", sortable: false },
      ],
      volunteersToEnroll: [
        /* data */
      ],
    };
  },
});
</script>
