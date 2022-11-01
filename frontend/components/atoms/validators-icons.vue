<template>
  <v-chip-group>
    <v-chip
      v-for="(validator, i) of validators"
      :key="i"
      small
      :color="getValidatorColor(validator)"
    >
      <v-icon small>
        {{ getValidatorIcon(validator) }}
      </v-icon>
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts">
import Vue from "vue";

interface Team {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export default Vue.extend({
  name: "ValidatorsIcons",
  props: {
    validatorsKey: {
      type: String,
      default: "fa_validators",
    },
    form: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      validators: [],
      teams: [] as Team[],
    };
  },
  mounted() {
    this.validators = this.$accessor.config.getConfig(this.validatorsKey);
    this.teams = this.$accessor.team.getAllTeams as Team[];
  },
  methods: {
    getValidatorIcon(validator: string) {
      return this.teams.find((team) => team.name === validator)?.icon;
    },
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
