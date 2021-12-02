<template>
  <div>
    <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
      <v-card-title>Besoin d'élec</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="electricityNeeds">
          <template #item.action="{ index }">
            <v-btn icon @click="deleteElectricityNeed(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions v-if="!isDisabled">
        <v-spacer></v-spacer>
        <v-btn text @click="isElectricityNeedDialogOpen = true">Ajouter</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isElectricityNeedDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter un besoin d'électricité</v-card-title>
        <v-card-text>
          <OverForm :fields="FORM" @form-change="onFormChange"></OverForm>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="addElectricityNeed">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverForm from "~/components/overForm.vue";

const headers = [
  { text: "type de raccordement", value: "connectionType" },
  {
    text: "puissance",
    value: "power",
  },
  { text: "action", value: "action" },
];

export default Vue.extend({
  name: "ElecLogisticCard",
  components: {
    OverForm,
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers,
    isElectricityNeedDialogOpen: false,
    FORM: [],
    newElectricityNeed: {},
  }),
  computed: {
    electricityNeeds() {
      return this.$accessor.FA.mFA.electricityNeeds;
    },
  },
  mounted() {
    this.FORM = this.$accessor.config.getConfig("fa_elec_form");
  },
  methods: {
    deleteElectricityNeed(index: number) {
      this.$accessor.FA.deleteElectricityNeed(index);
    },
    onFormChange(form: any) {
      this.newElectricityNeed = form;
    },
    addElectricityNeed() {
      this.$accessor.FA.addElectricityNeed(this.newElectricityNeed);
      this.isElectricityNeedDialogOpen = false;
    },
  },
});
</script>

<style scoped></style>
