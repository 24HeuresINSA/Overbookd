<template>
  <v-dialog v-model="dialog" max-width="50%">
    <v-card>
      <v-card-title style="margin-bottom: 1em">
        <span class="headline">{{ mEquipment.name }}</span>
      </v-card-title>
      <v-card-subtitle>
        <v-icon>mdi-map-marker</v-icon> {{ mEquipment.location }}
      </v-card-subtitle>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col md="2">
              <v-subheader> Commentaire : </v-subheader>
            </v-col>
            <v-col>
              <v-text-field
                v-model="mEquipment.comment"
                label="Commentaire"
                readonly
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="2">
              <v-subheader> Emplacment : </v-subheader>
            </v-col>
            <v-col>
              <v-text-field
                v-model="mEquipment.preciseLocation"
                label="Emplacement précis"
                readonly
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import cloneDeep from "lodash/cloneDeep";
import Vue from "vue";

export default Vue.extend({
  name: "EquipmentInformations",
  props: {
    equipment: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      title: "Informations sur l'équipement",
      mEquipment: cloneDeep(this.equipment),
    };
  },
  methods: {
    openDialog() {
      this.mEquipment = cloneDeep(this.equipment);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
  },
});
</script>

<style></style>
