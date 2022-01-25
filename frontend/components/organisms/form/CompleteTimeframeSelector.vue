<template>
  <v-container style="display: flex">
    <v-date-picker></v-date-picker>
    <v-container>
      <v-select></v-select>
      <v-select></v-select>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "CompleteTimeframeSelector",
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped></style>
