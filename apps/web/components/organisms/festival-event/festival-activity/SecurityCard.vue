<template>
  <v-card>
    <div v-if="canReview" class="review">
      <v-btn
        class="review__action"
        fab
        x-small
        color="success"
        :disabled="cantApprove"
        @click="approved"
      >
        <v-icon>mdi-check-circle-outline</v-icon>
      </v-btn>
      <v-btn
        class="review__action"
        fab
        x-small
        color="error"
        :disabled="cantReject"
        @click="reject"
      >
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </div>

    <v-card-title>Sécurité</v-card-title>
    <v-card-subtitle>
      Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu
      de ton activité, contacte
      <a href="mailto:securite@24heures.org">securite@24heures.org</a>.
    </v-card-subtitle>
    <v-card-text>
      <v-textarea
        :value="security.specialNeed"
        label="Dispositif de sécurité particulier"
        auto-grow
        rows="2"
        prepend-icon="mdi-security"
        @change="updateSpecialNeed"
      />
      <v-text-field
        :value="security.freePass"
        label="Nombre de laissez passer"
        prepend-icon="mdi-car"
        type="number"
        :rules="[rules.number, rules.min]"
        @change="updateFreePass"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  APPROVED,
  FestivalActivity,
  REJECTED,
  isDraft,
  secu,
} from "@overbookd/festival-activity";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

export default defineComponent({
  name: "SecurityCard",
  emits: ["reject"],
  data: (): InputRulesData => ({
    rules: {
      number: isNumber,
      min: min(0),
    },
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    security(): FestivalActivity["security"] {
      return this.mFA.security;
    },
    canReview(): boolean {
      return this.$accessor.user.isMemberOf(secu);
    },
    cantApprove(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.secu === APPROVED;
    },
    cantReject(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.secu === REJECTED;
    },
  },
  methods: {
    updateSpecialNeed(canBeEmpty: string) {
      const specialNeed = canBeEmpty.trim() ? canBeEmpty : null;
      this.$accessor.festivalActivity.updateSecurity({
        specialNeed,
      });
    },
    updateFreePass(freePass: number) {
      this.$accessor.festivalActivity.updateSecurity({
        freePass: +freePass,
      });
    },
    approved() {
      this.$accessor.festivalActivity.approveAs(secu);
    },
    reject() {
      this.$emit("reject", secu);
    },
  },
});
</script>

<style lang="scss" scoped>
.review {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
