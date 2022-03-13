<template>
  <v-card>
    <v-card-title>{{ user.firstname + " " + user.lastname }}</v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => undefined,
    },
  },
};
</script>

<style></style>
