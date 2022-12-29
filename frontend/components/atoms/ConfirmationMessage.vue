<template>
  <v-card class="confirmation">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="confirmation__title">
      <h2>
        <slot name="title">{{ title }}</slot>
      </h2>
    </v-card-title>
    <v-card-text>
      <p class="confirmation__statement">
        <slot name="statement">{{ message }}</slot>
      </p>
      <div class="btn-group">
        <v-btn :color="abortColor" dark large @click="closeDialog">
          <slot name="abort-btn-content"
            ><v-icon left> mdi-close-circle-outline </v-icon>Annuler</slot
          >
        </v-btn>
        <v-btn :color="confirmColor" dark large @click="confirm">
          <slot name="confirm-btn-content">
            <v-icon left> mdi-checkbox-marked-circle-outline </v-icon
            >Confirmer</slot
          >
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ConfirmamtionMessage",
  props: {
    title: {
      type: String,
      default: () => "Confirmation",
    },
    message: {
      type: String,
      default: () => "Vous êtes sur le point de confirmer",
    },
    confirmColor: {
      type: String,
      default: () => "success",
    },
    abortColor: {
      type: String,
      default: () => "warning",
    },
  },
  data() {
    return {
      dialog: false,
    };
  },

  methods: {
    confirm() {
      this.$emit("confirm");
      this.$emit("close-dialog");
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.confirmation {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__statement {
    font-size: 1.2rem;
  }
  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3%;
    .v-btn {
      flex-grow: 1;
    }
  }
}
</style>
