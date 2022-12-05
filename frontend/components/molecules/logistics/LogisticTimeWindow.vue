<template>
  <v-card>
    <v-card-title :disabled="isDisabled">Creneau de matos</v-card-title>
    <v-card-subtitle
      >Vous ne pouvez pas ajouter du matos sans ce creneau</v-card-subtitle
    >
    <v-card-text>
      <div v-show="gearTimeWindow" class="time-window">
        <span>{{ gearTimeWindow?.start }}</span>
        <span>{{ gearTimeWindow?.end }}</span>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="gearTimeWindow" text>Modifier le creneau</v-btn>
      <v-btn v-else text>Ajouter un creneau</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { time_windows } from "~/utils/models/FA";

export default Vue.extend({
  name: "LogisticTimeWindow",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    gearTimeWindow(): time_windows | undefined {
      return this.$accessor.FA.gearTimeWindow;
    },
  },
});
</script>
