<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>Sécurité</v-card-title>
    <v-card-subtitle
      >Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu
      de ton activité, contacte
      <a href="mailto:securite@24heures.org">securite@24heures.org</a
      >.</v-card-subtitle
    >
    <v-card-text>
      <v-form>
        <v-switch
          :value="mFA.isPassRequired"
          label="Besoin de laissez-passer"
          :disabled="isValidatedByOwner"
          @change="onChange('isPassRequired', $event)"
        ></v-switch>
        <v-text-field
          v-if="mFA.isPassRequired"
          :value="mFA.numberOfPass"
          label="Nombre de Pass Sécu"
          type="number"
          :rules="[rules.number, rules.min]"
          :disabled="isValidatedByOwner"
          @change="onChange('numberOfPass', $event)"
        ></v-text-field>
      </v-form>
      <v-textarea
        :value="mFA.securityNeed"
        label="Dispositif de sécurité particulier"
        auto-grow
        rows="2"
        :disabled="isValidatedByOwner"
        prepend-icon="mdi-security"
        @change="onChange('securityNeed', $event)"
      ></v-textarea>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardErrorList from "~/components/molecules/festivalEvent/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import { Fa, FaCardType } from "~/utils/models/fa";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "SecurityCard",
  components: { CardErrorList },
  data: () => ({
    owner: "secu",
    cardType: FaCardType.SECURITY,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mFA(): Fa {
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
      if (key === "numberOfPass") value = parseInt(value);
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>
