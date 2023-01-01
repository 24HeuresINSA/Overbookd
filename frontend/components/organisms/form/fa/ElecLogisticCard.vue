<template>
  <div>
    <v-card :class="isDisabled ? 'disabled' : ''">
      <v-card-title>Besoin d'électricité</v-card-title>
      <v-card-subtitle
        >Précise tes besoins en électricité : 1 ligne par type d'appareil. Pour
        plus de renseignement, vois avec la Log Elec via
        logistique@24heures.org</v-card-subtitle
      >
      <v-card-text>
        <v-data-table :headers="headers" :items="electricityNeeds">
          <template #[`item.electricity_type`]="{ item }">
            {{ getElectricityTypeLabel(item.electricity_type) }}
          </template>
          <template #[`item.action`]="{ index }">
            <v-btn v-if="!isDisabled" icon @click="openUpdateModal(index)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="!isDisabled"
              icon
              @click="deleteElectricityNeed(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions v-if="!isDisabled">
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
  electricity_type,
  electricity_type_label,
  fa_electricity_needs,
} from "~/utils/models/FA";
import ElecLogisticForm from "~/components/molecules/logistics/ElecLogisticForm.vue";

const headers = [
  { text: "Type de raccordement", value: "electricity_type" },
  { text: "Appareil", value: "device" },
  { text: "Puissance/appareil", value: "power" },
  { text: "Nombre", value: "count" },
  { text: "Commentaire", value: "comment" },
  { text: "Action", value: "action" },
];

export default Vue.extend({
  name: "ElecLogisticCard",
  components: { ElecLogisticForm },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers,
    isAddDialogOpen: false,
    isEditDialogOpen: false,

    selectedIndex: null as number | null,
  }),
  computed: {
    electricityNeeds(): fa_electricity_needs[] | undefined {
      return this.$accessor.FA.mFA.fa_electricity_needs;
    },
    electricityTypeLabels(): any[] {
      return Object.keys(electricity_type_label).map((type) => {
        return {
          type,
          label:
            electricity_type_label[type as keyof typeof electricity_type_label],
        };
      });
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
      if (!this.selectedIndex) return;
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
