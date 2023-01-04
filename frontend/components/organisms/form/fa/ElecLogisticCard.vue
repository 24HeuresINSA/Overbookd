<template>
  <div>
    <v-card :class="validationStatus">
      <v-card-title>Besoin d'électricité</v-card-title>
      <v-card-subtitle
        >Précise tes besoins en électricité : 1 ligne par type d'appareil. Pour
        plus de renseignement, vois avec la Log Elec via
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a
        >.</v-card-subtitle
      >
      <v-card-text>
        <v-data-table :headers="headers" :items="electricityNeeds">
          <template #[`item.electricity_type`]="{ item }">
            {{ getElectricityTypeLabel(item.electricity_type) }}
          </template>
          <template #[`item.power`]="{ item }"> {{ item.power }} W </template>
          <template #[`item.action`]="{ index }">
            <v-btn
              v-if="!isValidatedByOwner"
              icon
              @click="openUpdateModal(index)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="!isValidatedByOwner"
              icon
              @click="deleteElectricityNeed(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions v-if="!isValidatedByOwner">
        <v-spacer></v-spacer>
        <v-btn text @click="isAddDialogOpen = true"
          >Ajouter un besoin élec</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <ElecLogisticForm
        @change="addElectricityNeed"
        @close-dialog="isAddDialogOpen = false"
      ></ElecLogisticForm>
    </v-dialog>
    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <ElecLogisticForm
        :index="selectedIndex"
        @change="updateElectricityNeed"
        @close-dialog="isEditDialogOpen = false"
      ></ElecLogisticForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/fa/faUtils";
import {
  ElectricityTypeLabel,
  electricity_type,
  electricity_type_label,
  FA,
  fa_electricity_needs,
} from "~/utils/models/FA";
import ElecLogisticForm from "~/components/molecules/logistics/ElecLogisticForm.vue";

const headers = [
  { text: "Type de raccordement", value: "electricity_type" },
  { text: "Appareil", value: "device" },
  { text: "Puissance par appareil", value: "power" },
  { text: "Nombre", value: "count" },
  { text: "Commentaire", value: "comment" },
  { text: "Action", value: "action" },
];

export default Vue.extend({
  name: "ElecLogisticCard",
  components: { ElecLogisticForm },
  data: () => ({
    owner: "elec",
    headers,
    isAddDialogOpen: false,
    isEditDialogOpen: false,

    selectedIndex: null as number | null,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    electricityNeeds(): any {
      return this.mFA.fa_electricity_needs;
    },
    electricityType(): string[] {
      return Object.values(electricity_type);
    },
    electricityTypeLabels(): ElectricityTypeLabel[] {
      const elecTypeLabels: ElectricityTypeLabel[] = Object.keys(
        electricity_type_label
      ).map((type) => {
        return {
          type: type as electricity_type,
          label:
            electricity_type_label[type as keyof typeof electricity_type_label],
        };
      });
      return elecTypeLabels;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  methods: {
    getElectricityTypeLabel(type: electricity_type): string {
      return (
        this.electricityTypeLabels.find((label) => label.type === type)
          ?.label || ""
      );
    },
    openUpdateModal(index: number) {
      this.selectedIndex = index;
      this.isEditDialogOpen = true;
    },
    addElectricityNeed(elecNeed: fa_electricity_needs) {
      this.$accessor.FA.addElectricityNeed(elecNeed);
    },
    updateElectricityNeed(elecNeed: fa_electricity_needs) {
      if (this.selectedIndex === null) return;
      this.$accessor.FA.updateElectricityNeed({
        index: this.selectedIndex,
        elecNeed,
      });
    },
    deleteElectricityNeed(index: number) {
      this.$accessor.FA.deleteElectricityNeed(index);
    },
  },
});
</script>
