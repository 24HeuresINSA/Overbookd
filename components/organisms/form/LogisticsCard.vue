<template>
  <v-card :style="disabled ? `border-left: 5px solid green` : ``">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text style="display: flex">
      <LogisticsTable
        style="flex-grow: 3"
        :types="types"
        :store="store"
        :disabled="disabled"
      ></LogisticsTable>
      <LogisticsSelector
        v-if="!disabled"
        :types="types"
        :store="store"
      ></LogisticsSelector>
    </v-card-text>
  </v-card>
</template>

<script>
import LogisticsTable from "./LogisticsTable";
import LogisticsSelector from "./LogisticsSelector";

export default {
  name: "LogisticsCard",
  components: { LogisticsSelector, LogisticsTable },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    types: {
      type: Array,
      default: () => [],
    },
    store: {
      type: Object,
      default: () => null,
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
};
</script>

<style scoped></style>
