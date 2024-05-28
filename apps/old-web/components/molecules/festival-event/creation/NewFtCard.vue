<template>
  <v-card>
    <v-card-title>Ajouter une nouvelle Fiche tâche</v-card-title>
    <v-card-text>
      <v-text-field v-model="name" label="Nom de la FT" />
      <SearchFa v-model="selectedFa" :boxed="false" label="FA associée" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="cantCreateFt" @click="createNewFt">Créer la FT</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  FestivalActivity,
  FestivalTask,
  PreviewFestivalActivity,
} from "@overbookd/festival-event";
import SearchFa from "~/components/atoms/field/search/SearchFa.vue";

type MinimalFa = Pick<PreviewFestivalActivity, "id" | "name">;

type NewFtCardData = {
  name: string;
  selectedFa: MinimalFa | null;
};

export default Vue.extend({
  name: "NewFtCard",
  components: { SearchFa },
  data: (): NewFtCardData => ({
    name: "",
    selectedFa: null,
  }),
  computed: {
    selectedActivity(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    cantCreateFt(): boolean {
      return !this.name || !this.selectedFa;
    },
  },
  methods: {
    async createNewFt() {
      if (!this.name || !this.selectedFa) return;
      const blankFt = {
        name: this.name,
        festivalActivityId: this.selectedFa.id,
      };

      await this.$accessor.festivalTask.create(blankFt);
      if (!this.selectedTask.id) return;

      this.$emit("close-dialog");
      this.$router.push({ path: `/ft/${this.selectedTask.id}` });
    },
  },
});
</script>
