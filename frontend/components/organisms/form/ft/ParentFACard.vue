<template>
  <div>
    <v-card>
      <v-card-title>FA associée</v-card-title>
      <v-card-text>
        <SearchFA
          :fa="mFT.fa"
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
import { FASimplified } from "~/utils/models/FA";
import { FT } from "~/utils/models/ft";

export default Vue.extend({
  name: "ParentFACard",
  components: { SearchFA },
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    updateParentFA(fa: FASimplified | null) {
      const updatedFT = { ...this.mFT, fa: fa ?? undefined };
      this.$accessor.FT.updateFT(updatedFT);
    },
  },
});
</script>
