<template>
  <v-card :class="validationStatus">
    <v-card-title>Sécurité</v-card-title>
    <v-card-subtitle
      >Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu
      de ton activité, contacte securite@24heures.org</v-card-subtitle
    >
    <v-card-text>
      <v-form>
        <v-switch
          :value="mFA.is_pass_required"
          label="Besoin de Pass Sécu"
          :disabled="isValidatedByOwner"
          @change="onChange('is_pass_required', $event)"
        ></v-switch>
        <v-text-field
          v-if="mFA.is_pass_required"
          :value="mFA.number_of_pass"
          label="Nombre de Pass Sécu"
          type="number"
          :rules="[rules.number, rules.min]"
          :disabled="isValidatedByOwner"
          @change="onChange('number_of_pass', $event)"
        ></v-text-field>
      </v-form>
      <v-textarea
        :value="mFA.security_needs"
        label="Dispositif de sécurité particulier"
        auto-grow
        rows="2"
        :disabled="isValidatedByOwner"
        prepend-icon="mdi-security"
        @change="onChange('security_needs', $event)"
      ></v-textarea>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/fa/faUtils";
import { FA } from "~/utils/models/FA";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "SecurityCard",
  data: () => ({
    owner: "secu",
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      if (key === "number_of_pass") value = parseInt(value);
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>
