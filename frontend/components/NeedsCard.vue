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
        DRAFT: "grey",
        VALIDATED: "green",
        SUBMITTED: "yellow",
        REFUSED: "red",
        READY: "deep-purple",
      },
    };
  },
};
</script>
