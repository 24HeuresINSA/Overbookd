<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
    <v-card-title>Sécurité</v-card-title>
    <v-card-subtitle
      >Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu
      de ton activité, contacte securite@24heures.org</v-card-subtitle
    >
    <v-card-text>
      <v-textarea
        :value="mFA.security_needs"
        label="Dispositif de sécurité particulier"
        auto-grow
        rows="2"
        :disabled="isDisabled"
        prepend-icon="mdi-security"
        @change="onChange('security_needs', $event)"
      ></v-textarea>
      <v-form>
        <v-switch
          :value="mFA.is_pass_required"
          label="Besoin de Pass Sécu"
          :disabled="isDisabled"
          @change="onChange('is_pass_required', $event)"
        ></v-switch>
        <v-text-field
          v-if="mFA.is_pass_required"
          :value="mFA.number_of_pass"
          label="Nombre de Pass Sécu"
          type="number"
          :rules="[rules.number, rules.min]"
          :disabled="isDisabled"
          @change="onChange('number_of_pass', $event)"
        ></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FA } from "~/utils/models/FA";

export default Vue.extend({
  name: "SecurityCard",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    rules: {
      number: (value: string) =>
        !isNaN(parseInt(value, 10)) || "La valeur doit être un nombre",
      min: (value: string) =>
        parseInt(value, 10) >= 1 || "La valeur doit être supérieure à 0",
    },
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
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

<style scoped>
.disabled {
  border-left: 5px solid green;
}
</style>
