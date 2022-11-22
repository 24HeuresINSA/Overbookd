<template>
  <div>
    <v-card :style="isDisabled ? 'card-border' : ''">
      <v-card-title>Besoin d'élec</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="electricityNeeds">
          <template #item.action="{ index }">
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
        <v-btn text @click="isElectricityNeedDialogOpen = true">Ajouter</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isElectricityNeedDialogOpen" max-width="600">
      <v-card>
        <v-img src="/img/log/plugs.jpeg"></v-img>
        <v-card-title>Ajouter un besoin d'électricité</v-card-title>
        <v-card-text>
          <v-form>
            <v-select
              v-model="newElectricityNeed.connectionType"
              type="select"
              label="Type de prise*"
              :items="[
                'PC16',
                'P17 16A mono',
                'P17 16A tri',
                'P17 16A tetra',
                'P17 32A mono',
                'P17 32A tri',
                'P17 32A tetra',
              ]"
              dense
            ></v-select>

            <v-text-field
              v-model="newElectricityNeed.power"
              type="number"
              label="Puissance (en Watt)*"
            ></v-text-field>

            <v-text-field
              v-model="newElectricityNeed.comment"
              label="Commentaire"
            ></v-text-field>
          </v-form>
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

const headers = [
  { text: "Type de raccordement", value: "connectionType" },
  {
    text: "Puissance",
    value: "power",
  },
  { text: "Commentaire", value: "comment" },
  { text: "Action", value: "action" },
];

export default Vue.extend({
  name: "ElecLogisticCard",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers,
    isElectricityNeedDialogOpen: false,
    newElectricityNeed: {
      connectionType: "",
      power: "",
      comment: "",
    },
  }),
  computed: {
    electricityNeeds() {
      return this.$accessor.FA.mFA.electricityNeeds;
    },
  },
  methods: {
    deleteElectricityNeed(index: number) {
      this.$accessor.FA.deleteElectricityNeed(index);
    },
    addElectricityNeed() {
      if (!this.newElectricityNeed.connectionType) {
        alert("N'oublie pas de choisir le type de prise !");
        return;
      }

      this.newElectricityNeed.power = this.newElectricityNeed.power.replace(
        ",",
        "."
      );
      if (+this.newElectricityNeed.power <= 0) {
        alert("La puissance n'est pas valide...");
        return;
      }

      this.$accessor.FA.addElectricityNeed(this.newElectricityNeed);
      this.isElectricityNeedDialogOpen = false;
      this.newElectricityNeed = { connectionType: "", power: "", comment: "" };
    },
  },
});
</script>

<style scoped>
.card-border {
  border-left: 5px solid green;
}
</style>
