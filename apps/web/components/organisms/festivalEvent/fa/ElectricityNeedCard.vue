<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList :type="cardType" />
      <v-card-title> Besoin d'électricité </v-card-title>
      <v-card-subtitle>
        Précise tes besoins en électricité : 1 ligne par type d'appareil. Pour
        plus de renseignement, vois avec la Log Elec via
        <a href="mailto:logistique@24heures.org">logistique@24heures.org </a>.
      </v-card-subtitle>

      <v-card-text>
        <ElectricityNeedTable
          :electricity-needs="electricityNeeds"
          :disabled="isValidatedByOwner"
          @update="openEditDialog"
          @delete="deleteElectricityNeed"
        ></ElectricityNeedTable>
      </v-card-text>

      <v-card-actions v-if="!isValidatedByOwner">
        <v-spacer></v-spacer>
        <v-btn text @click="openAddDialog">
          Ajouter un besoin d'électricité
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <ElectricityNeedForm
        @change="addElectricityNeed"
        @close-dialog="closeAddDialog"
      ></ElectricityNeedForm>
    </v-dialog>
    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <ElectricityNeedForm
        :electricity-need="selectedElectricityNeed"
        @change="updateElectricityNeed"
        @close-dialog="closeEditDialog"
      ></ElectricityNeedForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ElectricityNeedForm from "~/components/molecules/festivalEvent/logistic/electricityNeed/ElectricityNeedForm.vue";
import ElectricityNeedTable from "~/components/molecules/festivalEvent/logistic/electricityNeed/ElectricityNeedTable.vue";
import CardErrorList from "~/components/molecules/festivalEvent/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import { Fa, FaCardType, FaElectricityNeed } from "~/utils/models/fa";

export default Vue.extend({
  name: "ElectricityNeedCard",
  components: {
    CardErrorList,
    ElectricityNeedTable,
    ElectricityNeedForm,
  },
  data: () => ({
    owner: "elec",
    cardType: FaCardType.ELEC,

    isAddDialogOpen: false,
    isEditDialogOpen: false,

    selectedElectricityNeed: null as FaElectricityNeed | null,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    electricityNeeds(): FaElectricityNeed[] {
      return this.mFA.electricityNeeds;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  methods: {
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
    openEditDialog(electricityNeed: FaElectricityNeed) {
      this.selectedElectricityNeed = electricityNeed;
      this.isEditDialogOpen = true;
    },
    closeEditDialog() {
      this.isEditDialogOpen = false;
      this.selectedElectricityNeed = null;
    },
    addElectricityNeed(electricityNeed: FaElectricityNeed) {
      this.$accessor.fa.addElectricityNeed(electricityNeed);
    },
    updateElectricityNeed(electricityNeed: FaElectricityNeed) {
      this.$accessor.fa.updateElectricityNeed(electricityNeed);
    },
    deleteElectricityNeed(electricityNeed: FaElectricityNeed) {
      this.$accessor.fa.deleteElectricityNeed(electricityNeed);
    },
  },
});
</script>
