<template>
  <v-data-table :headers="headers" :items="inventory" dense>
    <template #[`item.action`]="{ item }">
      <v-btn icon @click="addItemToFA(item)">
        <v-icon> mdi-plus</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { RepoFactory } from "../../../repositories/repoFactory";

export default {
  name: "LogisticsSelector",
  props: {
    type: {
      type: String,
      default: () => "",
    },
    store: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    repo: RepoFactory.equipmentRepo,
    inventory: [],
    headers: [
      { text: "nom", value: "name" },
      { text: "action", value: "action" },
    ],
  }),
  async mounted() {
    const FullInventory = (await this.repo.getAllEquipments(this)).data;
    this.inventory = FullInventory.filter((e) => e.type === this.type);
  },
  methods: {
    addItemToFA(item) {
      this.store.addEquipmentToFA({
        _id: item._id,
        name: item.name,
        type: this.type,
      });
    },
  },
};
</script>

<style scoped></style>
