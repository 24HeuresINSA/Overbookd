<template>
  <v-data-table :headers="headers" :items="equipments" dense>
    <template #[`item.action`]="{ item }">
      <div style="display: flex; align-items: center">
        <v-text-field
          style="max-width: 200px"
          type="number"
          label="# requis"
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
      { text: "Nom", value: "name" },
      { text: "Action", value: "action" },
    ],
  }),
  computed: {
    mForm: function () {
      if (this.store.mFT) {
        return this.store.mFT;
      }
      return this.$accessor.FA.mFA;
    },
    equipments: function () {
      return this.mForm.equipments.filter((e) => this.types.includes(e.type));
    },
  },
  methods: {
    updateItems(item, e) {
      this.store.updateEquipmentRequiredCount({ _id: item._id, count: +e });
    },
    deleteEquipment(id) {
      this.store.deleteEquipmentById(id);
    },
  },
};
</script>

<style scoped></style>
