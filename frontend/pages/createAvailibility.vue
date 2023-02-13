<template>
  <div>
    <v-card>
      <v-card-title>Création des disponibilités pour la manif</v-card-title>
      <v-card-text>
        <AvailabilitiesCreationTable />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="openDialog"> Ajouter un créneau </v-btn>
      </v-card-actions>
      <AvailabilitiesCreationCalendar />
    </v-card>

    <v-dialog v-model="isDialogOpen" max-width="600px">
      <AvailabilitiesCreationForm />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AvailabilitiesCreationCalendar from "~/components/molecules/timeframe/AvailabilitiesCreationCalendar.vue";
import AvailabilitiesCreationForm from "~/components/molecules/timeframe/AvailabilitiesCreationForm.vue";
import AvailabilitiesCreationTable from "~/components/molecules/timeframe/AvailabilitiesCreationTable.vue";

export default Vue.extend({
  name: "CreateAvailabilities",
  components: {
    AvailabilitiesCreationTable,
    AvailabilitiesCreationCalendar,
    AvailabilitiesCreationForm,
  },
  data: () => ({
    isDialogOpen: false,
  }),
  methods: {
    openDialog() {
      this.isDialogOpen = true;
    },
  },
});
</script>
