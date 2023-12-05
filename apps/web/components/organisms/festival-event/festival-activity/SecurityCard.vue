<template>
  <v-card>
    <div v-if="canReview" class="review">
      <v-btn class="review__action" fab x-small color="success">
        <v-icon>mdi-check-circle-outline</v-icon>
      </v-btn>
      <v-btn class="review__action" fab x-small color="error">
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
import { FestivalActivity } from "@overbookd/festival-activity";

export default defineComponent({
  name: "SecurityCard",
  computed: {
    security(): FestivalActivity["security"] {
      return this.$accessor.festivalActivity.selectedActivity.security;
    },
    canReview(): boolean {
      return this.$accessor.user.can("manage-admins");
    },
  },
  methods: {
    updateSpecialNeed(canBeEmpty: string) {
      const specialNeed = canBeEmpty.trim() ? canBeEmpty : null;
      this.$accessor.festivalActivity.updateSecurity({
        specialNeed,
      });
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
