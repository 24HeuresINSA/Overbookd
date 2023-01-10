<template>
  <div>
    <v-card>
      <v-card-title>FA associée</v-card-title>
      <v-card-text>
        <SearchFA
          :value="mFT.fa"
          label="FA associée"
          :boxed="false"
          @change="updateParentFA($event)"
        ></SearchFA>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchFA from "~/components/atoms/SearchFA.vue";
import { FA } from "~/utils/models/FA";
import { FT } from "~/utils/models/ft";

export default Vue.extend({
  name: "ParentFACard",
  components: {
    SearchFA,
  },
  data: () => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name" },
      { text: "Equipe", value: "team" },
      { text: "Resp", value: "inCharge" },
    ],
    parentFA: {} as FA,
    isFASelectDialogOpen: false,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    updateParentFA(fa: FA | null) {
      const updatedFT = { ...this.mFT, fa: fa ?? undefined };
      this.$accessor.FT.setFT(updatedFT);
    },
  },
});
</script>
