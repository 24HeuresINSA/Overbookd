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
        @click="rejected"
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
import { ReviewRejection } from "@overbookd/http";

export default defineComponent({
  name: "SecurityCard",
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
    approved() {
      this.$accessor.festivalActivity.approveAs(secu);
    },
    rejected() {
      const reason = "Section securité non valide";
      const rejection: ReviewRejection = { team: secu, reason };
      this.$accessor.festivalActivity.rejectBecause(rejection);
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
