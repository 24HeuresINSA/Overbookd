<template>
  <v-card>
    <v-card-title>Général</v-card-title>

    <v-card-subtitle>
      N'hésite pas si tu as des questions à contacter
      <a href="mailto:humain@24heures.org">humain@24heures.org</a>. Tu peux
      aussi t'aider en allant voir les FA d'avant sur
      <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a> en te
      connectant avec jeuneetcon@24heures.org.
    </v-card-subtitle>

    <v-card-text>
      <v-form>
        <v-text-field
          :value="general.name"
          label="Nom de la FA"
          @change="updateName($event)"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FestivalActivity } from "@overbookd/festival-activity";

export default Vue.extend({
  name: "FaGeneralCard",
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    general(): FestivalActivity["general"] {
      return this.mFA.general;
    },
  },
  methods: {
    updateName(name: string) {
      console.log("update name", name);
      // TODO: update name
    },
    updateDescription(description: string) {
      console.log("update description", description);
      // TODO: update description
    },
  },
});
</script>
