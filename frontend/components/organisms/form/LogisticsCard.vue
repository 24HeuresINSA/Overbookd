<template>
  <v-card :style="disabled ? `border-left: 5px solid green` : ``">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row dense>
          <v-col v-if="disabled" cols="12">
            <LogisticsTable
              :types="types"
              :store="store"
              :disabled="disabled"
            ></LogisticsTable>
          </v-col>
          <v-col v-else cols="12" lg="8">
            <LogisticsTable
              :types="types"
              :store="store"
              :disabled="disabled"
            ></LogisticsTable>
          </v-col>
          <v-col v-if="!disabled" cols="12" lg="4">
            <v-row dense justify="space-between">
              <v-col cols="12" lg="10" md="11">
                <v-autocomplete
                  v-model="item"
                  dense
                  filled
                  :items="typeFilteredEquipment"
                  item-text="name"
                  return-object
                  chips
                  allow-overflow
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" lg="2" md="1">
                <v-btn :disabled="!validInput" rounded @click="addItem">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <LogisticsSelector
              :types="types"
              :store="store"
            ></LogisticsSelector>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import LogisticsTable from "./LogisticsTable.vue";
import LogisticsSelector from "./LogisticsSelector.vue";
import Vue, { PropType } from "vue";

/**
 * @displayName Logistics Card
 * Card to manage equipments in FAs
 */
export default Vue.extend({
  name: "LogisticsCard",
  components: { LogisticsSelector, LogisticsTable },
  props: {
    /**
     * The title to be displayed
     */
    title: {
      type: String,
      default: () => "",
    },
    /**
     * Array of categories allowed for this component
     */
    types: {
      type: Array,
      default: () => [],
    },
    /**
     * The store to use when adding new equipment
     */
    store: {
      type: Object,
      required: true,
    },
    /**
     * If the element is editable or not
     */
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      // Item linked to v-autocomplete component
      item: undefined as undefined | any,
    };
  },
  computed: {
    equipment: function (): Array<any> {
      return this.$accessor.equipment.items;
    },
    /**
     * @returns validEquipments are filtered by isValid !== false (ie: does not exist or true)
     */
    validEquipments: function (): Array<any> {
      return this.equipment.filter((e) => e.isValid !== false);
    },
    validInput: function (): boolean {
      return !(this.item == undefined);
    },
    typeFilteredEquipment: function (): Array<any> {
      return this.validEquipments.filter((e) => this.types.includes(e.type));
    },
  },
  async mounted() {
    // fetchAll calls api to fetch all available equipment
    await this.$accessor.equipment.fetchAll();
  },
  methods: {
    /**
     * Add item to FA store
     */
    async addItem() {
      if (this.item) {
        if (this.store.addEquipment) {
          await this.store.addEquipment({
            _id: this.item._id,
            name: this.item.name,
            type: this.item.type,
          });
          this.item = undefined;
        }
      }
    },
  },
});
</script>

<style scoped></style>
