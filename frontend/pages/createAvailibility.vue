<template>
  <div>
    <v-card>
      <v-card-title>Création des disponibilités pour la manif</v-card-title>
      <v-card-text>
        <AvailabilitiesCreationTable
          @update="openEditDialog"
          @delete="deleteAvailability"
        ></AvailabilitiesCreationTable>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="openAddDialog"> Ajouter un créneau </v-btn>
      </v-card-actions>
      <AvailabilitiesCreationCalendar />
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600px">
      <AvailabilitiesCreationForm @confirm="addAvailability" />
    </v-dialog>
    <v-dialog v-model="isUpdateDialogOpen" max-width="600px">
      <AvailabilitiesCreationForm
        :availability="selectedAvailability"
        @confirm="updateAvailability"
      ></AvailabilitiesCreationForm>
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
    selectedAvailability: null,

    isAddDialogOpen: false,
    isUpdateDialogOpen: false,
  }),
  methods: {
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    openEditDialog(availability: any) {
      this.selectedAvailability = availability;
      this.isUpdateDialogOpen = true;
    },
    addAvailability() {
      console.log("addAvailability");
      this.isAddDialogOpen = false;
    },
    updateAvailability() {
      console.log("updateAvailability");
      this.isUpdateDialogOpen = false;
    },
    deleteAvailability() {
      console.log("deleteAvailability");
    },
  },
});
</script>
