<template>
  <v-data-table
    :headers="headers"
    :items="signages"
    item-key="key"
    :items-per-page="-1"
    disable-pagination
    hide-default-footer
    dense
  >
    <template #item.actions="{ item }">
      <div v-if="!disabled">
        <v-btn icon @click="updateSignage(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteSignage(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
    <template #no-data> Aucune demande de signalétique </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Signage } from "@overbookd/festival-activity";

export default defineComponent({
  name: "FaSignageTable",
  props: {
    signages: {
      type: Array as () => Signage[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    headers: [
      { text: "Quantité", value: "quantity" },
      { text: "Type", value: "type" },
      { text: "Texte à écrire", value: "text", sortable: false },
      { text: "Taille", value: "size", sortable: false },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  methods: {
    updateSignage(signage: Signage) {
      this.$emit("update", signage);
    },
    deleteSignage(signage: Signage) {
      this.$emit("delete", signage);
    },
  },
});
</script>
