<template>
  <v-card>
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
        @change="updateSpecialNeed($event)"
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
  },
  methods: {
    updateSpecialNeed(specialNeed: string) {
      console.log("update SpecialNeed", specialNeed);
      // TODO: update special need
    },
  },
});
</script>
