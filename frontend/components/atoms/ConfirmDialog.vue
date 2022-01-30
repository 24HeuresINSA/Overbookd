<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Confirmation</span>
      </v-card-title>
      <v-card-text>
        <slot>Validez-vous cetta action ?</slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="dialog = false"
          >Annuler</v-btn
        >
        <v-btn
          color="blue darken-1"
          @click="
            dialog = false;
            $emit('confirm');
          "
          >Confirmer</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "ConfirmDialog",
  props: {},
  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    confirm() {
      this.$emit("confirm");
    },
    open() {
      this.dialog = true;
    },
  },
});
</script>

<style></style>
