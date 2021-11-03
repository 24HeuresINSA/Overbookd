<template>
  <v-data-table :headers="headers" :items="equipments" dense>
    <template #[`item.action`]="{ item, index }">
      <div style="display: flex; align-items: center">
        <v-text-field
          style="max-width: 200px"
          type="number"
          label="# requit"
          :value="item.required"
          :disabled="disabled"
          @change="updateItems(item, $event)"
        ></v-text-field>
        <v-btn v-if="!disabled" icon @click="deleteEquipment(item._id)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: "LogisticsTable",
  props: {
    types: {
      type: Array,
      default: () => [],
    },
    store: {
      type: Object,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers: [
      { text: "nom", value: "name" },
      { text: "action", value: "action" },
    ],
  }),
  computed: {
    mFA: function () {
      return this.$accessor.FA.mFA;
    },
    equipments: function () {
      return this.mFA.equipments.filter((e) => this.types.includes(e.type));
    },
  },
  methods: {
    updateItems(item, e) {
      this.store.updateEquipmentRequiredCount({ _id: item._id, count: +e });
    },
    deleteEquipment(id) {
      this.store.deleteEquipment(id);
    },
  },
};
</script>

<style scoped></style>
