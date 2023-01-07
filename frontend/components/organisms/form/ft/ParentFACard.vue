<template>
  <div>
    <v-card>
      <v-card-title>FA associée</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="parentFAs"
          :hide-default-footer="true"
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!mFT.fa" text @click="unlinkFA">Détacher la FA</v-btn>
        <v-btn :disabled="mFT.fa" text @click="openFAChooser"
          >Choisir une FA parente</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isFASelectDialogOpen" max-width="500px">
      <FAChooser
        @close-dialog="closeFAChooser"
        @change="updateParentFA"
      ></FAChooser>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FAChooser from "~/components/molecules/FAChooser.vue";
import { FA } from "~/utils/models/FA";
import { FT } from "~/utils/models/FT";

export default Vue.extend({
  name: "ParentFACard",
  components: {
    FAChooser,
  },
  data: () => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name" },
      { text: "Equipe", value: "Team" },
      { text: "Resp", value: "user_in_charge" },
    ],

    parentFAs: [] as FA[],
    isFASelectDialogOpen: false,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  async mounted() {
    if (this.mFT.fa) await this.initParentFas(this.mFT.fa);
  },
  methods: {
    async initParentFas(id: number) {
      const fa = await this.$accessor.FA.getFAbyId(id);
      this.parentFAs = fa ? [fa] : [];
    },
    updateParentFA(faId: number) {
      this.$accessor.FT.updateFT({ key: "fa", value: faId });
      this.isFASelectDialogOpen = false;
    },
    unlinkFA() {
      this.$accessor.FT.updateFT({ key: "fa", value: undefined });
    },
    openFAChooser() {
      this.isFASelectDialogOpen = true;
    },
    closeFAChooser() {
      this.isFASelectDialogOpen = false;
    },
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>
