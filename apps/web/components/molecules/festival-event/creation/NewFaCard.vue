<template>
  <v-card>
    <v-card-title>Ajouter une nouvelle FA</v-card-title>
    <v-card-text>
      <v-text-field v-model="faName" label="Nom de la FA"></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="!faName" @click="createNewFa">Créer la FA</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Fa, CreateFa } from "~/utils/models/fa.model";

export default Vue.extend({
  name: "NewFaCard",
  props: {
    faId: {
      type: Number,
      default: undefined,
    },
  },
  data: () => ({
    faName: "",
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
  },
  methods: {
    async createNewFa() {
      if (!this.faName) return;
      const blankFa: CreateFa = { name: this.faName };

      await this.$accessor.fa.createFa(blankFa);
      if (!this.mFA?.id) return;

      this.$emit("close-dialog");
      this.$router.push({ path: `/fa/${this.mFA.id}` });
    },
  },
});
</script>
