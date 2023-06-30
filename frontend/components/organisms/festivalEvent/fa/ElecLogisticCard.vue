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
          <template #[`item.electricityType`]="{ item }">
            {{ getElectricityTypeLabel(item.electricityType) }}
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
import ElecLogisticForm from "~/components/molecules/festivalEvent/logistic/ElecLogisticForm.vue";
import {
getFAValidationStatus,
isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import {
ElectricityType,
ElectricityTypeLabel,
ElectricityTypeWithLabel,
FA,
FaElectricityNeed,
} from "~/utils/models/fa";

const headers = [
  { text: "Type de raccordement", value: "electricityType" },
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
    electricityNeeds(): FaElectricityNeed[] {
      return this.mFA.faElectricityNeeds ?? [];
    },
    electricityType(): string[] {
      return Object.values(ElectricityType);
    },
    electricityTypeLabels(): ElectricityTypeWithLabel[] {
      const elecTypeLabels: ElectricityTypeWithLabel[] = Object.keys(
        ElectricityTypeLabel
      ).map((type) => {
        return {
          type: type as ElectricityType,
          label:
            ElectricityTypeLabel[type as keyof typeof ElectricityTypeLabel],
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
    getElectricityTypeLabel(type: ElectricityType): string {
      return (
        this.electricityTypeLabels.find((label) => label.type === type)
          ?.label || ""
      );
    },
    openUpdateModal(index: number) {
      this.selectedIndex = index;
      this.isEditDialogOpen = true;
    },
    addElectricityNeed(elecNeed: FaElectricityNeed) {
      this.$accessor.FA.addElectricityNeed(elecNeed);
    },
    updateElectricityNeed(elecNeed: FaElectricityNeed) {
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
