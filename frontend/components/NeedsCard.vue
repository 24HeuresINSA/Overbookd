<template>
  <v-card :class="`px-2 ${possibleStatus[status]}`" tile outlined>
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  props: { status: { type: String, required: true } },
  data() {
    return {
      possibleStatus: {
        draft: "grey",
        validated: "green",
        submitted: "yellow",
        refused: "red",
        ready: "deep-purple",
      },
    };
  },
};
</script>
