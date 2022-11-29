<template>
  <v-chip-group>
    <v-chip
      v-for="(validator, i) of validators"
      :key="i"
      small
      :color="getValidatorColor(validator.name)"
    >
      <v-icon small>
        {{ validator.icon }}
      </v-icon>
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ValidatorsIcons",
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  computed: {
    validators(): Array<any> {
      return this.$accessor.team.faValidators;
    },
  },
  async mounted() {
    console.log("test");
  },
  methods: {
    getValidatorColor(validator: string) {
      if (this.form.validated.includes(validator)) {
        // validated
        return "green";
      } else if (this.form.refused.includes(validator)) {
        // refused
        return "red";
      }
    },
  },
});
</script>

<style scoped>
.v-btn-toggle--group > .v-btn.v-btn {
  margin: 0;
}
</style>
