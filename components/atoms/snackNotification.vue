<template>
  <v-snackbar v-model="toggle" :timeout="timeout">
    {{ message }}
    <template #action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="toggle = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "SnackNotification",
  props: {
    setTimeout: {
      type: Number,
      default: () => {
        3000;
      },
    },
    setMessage: {
      type: String,
      default: () => {
        ("");
      },
    },
    setId: {
      type: Number,
      default: () => {
        0;
      },
    },
  },
  data() {
    return {
      toggle: true,
      timeout: this.setTimeout,
      message: this.setMessage,
    };
  },
  watch: {
    setToggle: function (val) {
      this.toggle = val;
    },
    setTimeout: function (val) {
      this.timeout = val;
    },
    setMessage: function (val) {
      this.message = val;
    },
    toggle: function (val) {
      if (!val) {
        console.log("Delete notif with id : " + this.setId);
        this.$store.dispatch("notif/popNotification", this.setId);
      }
    },
  },
});
</script>
