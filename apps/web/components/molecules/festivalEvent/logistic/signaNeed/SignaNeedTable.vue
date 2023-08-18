<template>
  <v-data-table
    :headers="headers"
    :items="signaNeeds"
    dense
    item-key="key"
    :items-per-page="-1"
    disable-pagination
    hide-default-footer
  >
    <template #item.action="{ item }">
      <div v-if="!disabled">
        <v-btn icon @click="updateSignaNeed(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteSignaNeed(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
    <template #no-data> Aucun besoin de signalétique ajouté </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { FaSignaNeed } from "~/utils/models/fa";

export default Vue.extend({
  name: "SignaNeedTable",
  props: {
    signaNeeds: {
      type: Array as () => FaSignaNeed[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    headers: [
      { text: "Nombre", value: "count", sortable: false },
      { text: "Type", value: "signaType", sortable: false },
      { text: "Texte signalétique", value: "text", sortable: false },
      { text: "Taille", value: "size", sortable: false },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ],
  }),
  methods: {
    updateSignaNeed(signaNeed: FaSignaNeed) {
      this.$emit("update", signaNeed);
    },
    deleteSignaNeed(signaNeed: FaSignaNeed) {
      this.$emit("delete", signaNeed);
    },
  },
});
</script>
