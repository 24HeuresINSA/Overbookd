<template>
  <v-card :class="isDisabled ? 'card-border' : ''">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-container>
        <div v-if="!isDisabled" class="flex-row">
          <SearchGear gear="matos"></SearchGear>
          <v-btn rounded class="margin-btn" @click="addItem">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <LogisticsTable
          :types="types"
          :store="store"
          :disabled="isDisabled"
        ></LogisticsTable>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import LogisticsTable from "~/components/molecules/logistics/LogisticsTable.vue";
import SearchGear from "~/components/atoms/SearchGear.vue";

export default Vue.extend({
  name: "LogisticsCard",
  components: { LogisticsTable, SearchGear },
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
    isDisabled: {
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

<style scoped>
.card-border {
  border-left: 5px solid green;
}

.flex-row {
  display: flex;
  align-items: center;
}

.flex-row .margin-btn {
  margin-left: 20px;
  margin-bottom: 30px;
}
</style>
