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
import { Ft, FtCreation } from "~/utils/models/ft";

export default Vue.extend({
  name: "NewFTCard",
  props: {
    faId: {
      type: Number,
      default: undefined,
    },
  },
  data: () => ({
    ftName: "",
  }),
  computed: {
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
  },
  methods: {
    async createNewFT() {
      if (!this.ftName) return;
      const blankFT: FtCreation = {
        name: this.ftName,
        parentFaId: this.faId,
      };

      await this.$accessor.ft.createFT(blankFT);
      if (!this.mFT?.id) return;

      this.$emit("close-dialog");
      this.$router.push({ path: `/ft/${this.mFT.id}` });
    },
  },
});
</script>
