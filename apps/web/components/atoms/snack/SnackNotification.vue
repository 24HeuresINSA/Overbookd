<template>
  <v-snackbar v-model="toggle" :timeout="timeout">
    <p v-for="(part, index) in messages" :key="index">{{ part }}</p>
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
        return 3000;
      },
    },
    setMessage: {
      type: String,
      default: () => {
        return "";
      },
    },
    setId: {
      type: Number,
      default: () => {
        return 0;
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
  computed: {
    messages(): string[] {
      return this.message.split("\n");
    },
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
        this.$store.dispatch("notif/popNotification", this.setId);
        this.$accessor.notif.popNotification(this.setId);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 5px;
}
</style>
