<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>Sécurité</v-card-title>
    <v-card-subtitle
      >Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu
      de ton activité, contacte
      <a href="mailto:securite@24heures.org">securite@24heures.org</a>.
    </v-card-subtitle>
    <v-card-text>
      <v-form>
        <v-switch
          v-model="isPassRequired"
          label="Besoin de laissez-passer"
          :disabled="isValidatedByOwner"
          @change="clearNumberOfPass($event)"
        ></v-switch>
        <v-text-field
          v-if="isPassRequired"
          :value="mFA.numberOfPass"
          label="Nombre de Pass Sécu"
          type="number"
          :rules="[rules.number, rules.min]"
          :disabled="isValidatedByOwner"
          @change="updateNumberOfPass($event)"
        ></v-text-field>
      </v-form>
      <v-textarea
        :value="mFA.securityNeed"
        label="Dispositif de sécurité particulier"
        auto-grow
        rows="2"
        :disabled="isValidatedByOwner"
        prepend-icon="mdi-security"
        @change="updateSecurityNeed($event)"
      ></v-textarea>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festival-event/faUtils";
import { Fa, FaCardType } from "~/utils/models/fa.model";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "SecurityCard",
  components: { CardErrorList },
  data: () => ({
    owner: "secu",
    cardType: FaCardType.SECURITY,

    isPassRequired: false,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  watch: {
    signaNeeds: {
      handler() {
        if (this.mFA.numberOfPass) {
          this.isPassRequired = true;
        }
      },
      deep: true,
    },
  },
  methods: {
    shouldUpdateNumberOfPass(numberOfPass?: number): boolean {
      return Boolean(
        numberOfPass &&
          numberOfPass > 0 &&
          numberOfPass !== this.mFA.numberOfPass,
      );
    },
    clearNumberOfPass(isPassRequired: boolean) {
      if (isPassRequired) return;
      return this.$accessor.fa.updateFaChunk({ numberOfPass: undefined });
    },
    updateNumberOfPass(numberOfPassString: string) {
      const numberOfPass = parseInt(numberOfPassString, 10);
      if (!this.shouldUpdateNumberOfPass(numberOfPass)) return;
      return this.$accessor.fa.updateFaChunk({ numberOfPass });
    },
    updateSecurityNeed(securityNeed: string) {
      return this.$accessor.fa.updateFaChunk({
        securityNeed: securityNeed.trim(),
      });
    },
  },
});
</script>
