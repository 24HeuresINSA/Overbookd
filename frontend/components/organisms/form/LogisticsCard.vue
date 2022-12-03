<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-container>
        <div v-if="!isDisabled" class="flex-row">
          <SearchGear :gear="gear" @change="updateCurrentGear"></SearchGear>
          <v-btn rounded class="margin-btn" @click="addGear">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <LogisticsTable
          :store="store"
          :is-disabled="isDisabled"
        ></LogisticsTable>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import LogisticsTable from "~/components/molecules/logistics/LogisticsTable.vue";
import SearchGear from "~/components/atoms/SearchGear.vue";
import { Gear } from "~/utils/models/catalog.model";
import { fa_gears } from "~/utils/models/FA";

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
  data: () => ({
    gear: undefined as Gear | undefined,
  }),
  methods: {
    updateCurrentGear(gear: Gear | undefined) {
      this.gear = gear;
    },
    async addGear() {
      if (this.gear) {
        const faGear: fa_gears = {
          gear: this.gear,
          quantity: 1,
        };
        await this.store.addGear(faGear);
      }
    },
  },
});
</script>

<style scoped>
.disabled {
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
