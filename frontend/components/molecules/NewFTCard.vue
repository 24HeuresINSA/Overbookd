<template>
  <v-card>
    <v-card-title>Ajouter une nouvelle FT</v-card-title>
    <v-card-text>
      <v-text-field v-model="ftName" label="Nom de la FT"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!ftName" @click="createNewFT">Créer la FT</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FT, FTCreation } from "~/utils/models/ft";

export default Vue.extend({
  name: "NewFTCard",
  data: () => ({
    ftName: "",
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    async createNewFT() {
      if (!this.ftName) return;
      const blankFT: FTCreation = {
        name: this.ftName,
      };
      await this.$accessor.FT.createFT(blankFT);

      if (!this.mFT?.id) return;
      this.$router.push({ path: `/ft/${this.mFT.id}` });
      this.$emit("close-dialog");
    },
  },
});
</script>
