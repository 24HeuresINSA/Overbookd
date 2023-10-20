<template>
  <v-card>
    <v-card-title>Ajouter une nouvelle Fiche Activité</v-card-title>
    <v-card-text>
      <v-text-field v-model="name" label="Nom de la FA"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!name" @click="createNewFa">Créer la FA</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FestivalActivityRepresentation } from "@overbookd/festival-activity";

export default defineComponent({
  name: "NewFaCard",
  props: {
    faId: {
      type: Number,
      default: undefined,
    },
  },
  data: () => ({
    name: "",
  }),
  computed: {
    selectedActivity(): FestivalActivityRepresentation | null {
      return this.$accessor.festivalActivity.selectedActivity;
    },
  },
  methods: {
    async createNewFa() {
      if (!this.name) return;
      const blankFa = { name: this.name };

      await this.$accessor.festivalActivity.create(blankFa);
      if (!this.selectedActivity?.id) return;

      this.$emit("close-dialog");
      this.$router.push({ path: `/fa/${this.selectedActivity.id}` });
    },
  },
});
</script>
