<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-form v-if="!isDisabled" class="flex-row">
          <v-text-field
            type="number"
            label="Quantité"
            v-model="quantity"
            :rules="[rules.number, rules.min]"
          />
          <SearchGear
            :gear="gear"
            :owner="owner"
            @change="updateCurrentGear"
          ></SearchGear>
          <v-btn
            rounded
            class="margin-btn"
            @click="addGear"
            :disabled="!isValid"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-form>
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
import { time_windows_type } from "~/utils/models/FA";

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
    owner: {
      type: String,
      default: () => "",
    },
  },
  data: () => ({
    gear: undefined as Gear | undefined,
    quantity: 1,
    rules: {
      number: (value: string) =>
        !isNaN(parseInt(value, 10)) || "La valeur doit être un nombre",
      min: (value: string) =>
        parseInt(value, 10) >= 1 || "La valeur doit être supérieure à 0",
    },
  }),
  computed: {
    isValid() {
      return (
        this.gear &&
        this.quantity >= 1 &&
        this.$accessor.FA.mFA.time_windows?.find(
          (tw) => tw.type === time_windows_type.MATOS
        )
      );
    },
  },
  methods: {
    updateCurrentGear(gear: Gear | undefined) {
      this.gear = gear;
    },
    async addGear() {
      if (this.gear) {
        const faGear: any = {
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
  gap: 1rem;
}

.flex-row .margin-btn {
  margin-left: 20px;
  margin-bottom: 30px;
}
</style>
