<template>
  <v-card :style="disabled ? `border-left: 5px solid green` : ``">
    <v-card-title>{{ title }}</v-card-title>
    <LogisticsTable
      :type="type"
      :store="store"
      :disabled="disabled"
    ></LogisticsTable>
    <LogisticsSelector
      v-if="!disabled"
      :type="type"
      :store="store"
    ></LogisticsSelector>
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
    type: {
      type: String,
      default: () => "",
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
