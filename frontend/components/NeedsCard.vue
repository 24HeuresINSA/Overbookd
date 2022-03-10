<template>
  <v-card :class="`px-2 ${possibleStatus[status]}`" tile outlined>
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  props: ["status", "count"],
  data() {
    return {
      possibleStatus: {
        draft: "grey",
        validated: "green",
        submitted: "yellow",
        refused: "red",
      },
    };
  },
};
</script>
