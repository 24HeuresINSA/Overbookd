<template>
  <v-treeview :items="items" dense>
    <template #label="{ item }">
      <v-btn v-if="!item.children" icon @click="addItemToFA(item)">
        <v-icon> mdi-plus </v-icon>
      </v-btn>
      <label>{{ item.name }}</label>
    </template>
  </v-treeview>
</template>

<script>
import { RepoFactory } from "../../../repositories/repoFactory";

export default {
  name: "LogisticsSelector",
  props: {
    types: {
      type: Array,
      default: () => [],
    },
    store: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    repo: RepoFactory.equipmentRepo,
    headers: [
      { text: "nom", value: "name" },
      { text: "action", value: "action" },
    ],
    fullInventory: [],
    inventory: [],
    items: [],
  }),
  watch: {
    types() {
      if (this.types) {
        this.inventory = this.fullInventory.filter((e) =>
          this.types.includes(e.type)
        );

        let items = [];
        this.types.forEach((type) => {
          items.push({
            name: type,
            children: this.inventory.filter((e) => e.type === type),
          });
        });
        this.items = items;
      }
      return [];
    },
  },
  async mounted() {
    this.fullInventory = (await this.repo.getAllEquipments(this)).data;
  },
  methods: {
    addItemToFA(item) {
      this.store.addEquipmentToFA({
        _id: item._id,
        name: item.name,
        type: item.type,
      });
    },
  },
};
</script>

<style scoped></style>
