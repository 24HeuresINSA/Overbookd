<template>
  <v-data-table :headers="headers" :items="gears" dense>
    <template #[`item.quantity`]="{ index, item }">
      <v-text-field
        :value="item.count ? item.count : '1'"
        type="number"
        min="0"
        step="1"
        :disabled="isDisabled"
        class="text-width"
        @change="updateGearQuantity(index, $event)"
      ></v-text-field>
    </template>
    <template #[`item.action`]="{ item }">
      <v-btn v-if="!isDisabled" icon @click="deleteGear(item.id)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LogisticsTable",
  props: {
    store: {
      type: Object,
      default: () => {},
    },
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers: [
      { text: "Nom", value: "name" },
      { text: "Quantité", value: "quantity" },
      { text: "Action", value: "action" },
    ],
  }),
  computed: {
    gears(): any {
      return this.store.mFA.fa_gears;
    },
  },
  methods: {
    updateGearQuantity(gear: any, quantity: number) {
      this.store.updateGearQuantity({ gear: gear, quantity: +quantity });
    },
    deleteGear(id: number) {
      this.store.deleteGear(id);
    },
  },
});
</script>

<style scoped>
.text-width {
  max-width: 200px;
}
</style>
