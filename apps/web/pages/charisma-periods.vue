<template>
  <div>
    <v-card>
      <v-card-title>Assignation du charisme aux disponibilités</v-card-title>
      <v-card-text>
        <CharismaPeriodTable
          @update="openEditDialog"
          @delete="deleteCharismaPeriod"
        ></CharismaPeriodTable>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="openAddDialog"> Ajouter un créneau </v-btn>
      </v-card-actions>
      <CharismaPeriodCalendar />
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600px">
      <CharismaPeriodForm @create="addCharismaPeriod" />
    </v-dialog>
    <v-dialog v-model="isUpdateDialogOpen" max-width="600px">
      <CharismaPeriodForm
        :charisma-period="selectedCharismaPeriod"
        @update="updateCharismaPeriod"
      ></CharismaPeriodForm>
    </v-dialog>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import CharismaPeriodCalendar from "~/components/molecules/charisma-period/CharismaPeriodCalendar.vue";
import CharismaPeriodForm from "~/components/molecules/charisma-period/CharismaPeriodForm.vue";
import CharismaPeriodTable from "~/components/molecules/charisma-period/CharismaPeriodTable.vue";
import { CharismaPeriod, SavedCharismaPeriod } from "@overbookd/http";

export default Vue.extend({
  name: "CharismaPeriods",
  components: {
    SnackNotificationContainer,
    CharismaPeriodCalendar,
    CharismaPeriodForm,
    CharismaPeriodTable,
  },
  data: () => ({
    selectedCharismaPeriod: null as SavedCharismaPeriod | null,

    isAddDialogOpen: false,
    isUpdateDialogOpen: false,
  }),
  head: () => ({
    title: "Charisme des dispos",
  }),
  async mounted() {
    await this.$accessor.charismaPeriod.fetchCharismaPeriods();
  },
  methods: {
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    openEditDialog(charismaPeriod: SavedCharismaPeriod) {
      this.selectedCharismaPeriod = charismaPeriod;
      this.isUpdateDialogOpen = true;
    },
    async addCharismaPeriod(charismaPeriod: CharismaPeriod) {
      await this.$accessor.charismaPeriod.addCharismaPeriod(charismaPeriod);
      this.isAddDialogOpen = false;
    },
    async updateCharismaPeriod(charismaPeriod: SavedCharismaPeriod) {
      await this.$accessor.charismaPeriod.updateCharismaPeriod(charismaPeriod);
      this.isUpdateDialogOpen = false;
    },
    async deleteCharismaPeriod(charismaPeriod: SavedCharismaPeriod) {
      await this.$accessor.charismaPeriod.deleteCharismaPeriod(charismaPeriod);
    },
  },
});
</script>
