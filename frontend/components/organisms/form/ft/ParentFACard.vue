<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>FA associée</v-card-title>
    <v-card-text>
      <SearchFA
        :fa="mFT.fa"
        label="FA associée"
        :boxed="false"
        :disabled="isValidatedByOwner"
        @change="updateParentFA($event)"
      ></SearchFA>
      <CompleteLogisticsTable v-if="mFT.fa" class="elevation-1" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchFA from "~/components/atoms/SearchFA.vue";
import CardErrorList from "~/components/molecules/CardErrorList.vue";
import CompleteLogisticsTable from "~/components/molecules/logistics/CompleteLogisticsTable.vue";
import {
  getFTValidationStatus,
  isTaskValidatedBy,
} from "~/utils/festivalEvent/ftUtils";
import { FASimplified } from "~/utils/models/FA";
import { FT, FTCardType } from "~/utils/models/ft";

export default Vue.extend({
  name: "ParentFACard",
  components: { SearchFA, CompleteLogisticsTable, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: FTCardType.PARENT_FA,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    isValidatedByOwner(): boolean {
      return isTaskValidatedBy(this.mFT.reviews, this.owner);
    },
    validationStatus(): string {
      return getFTValidationStatus(this.mFT, this.owner).toLowerCase();
    },
  },
  methods: {
    updateParentFA(fa: FASimplified | null) {
      const updatedFT = { ...this.mFT, fa: fa ?? undefined };
      this.$accessor.FT.updateFT(updatedFT);
      if (fa) this.$accessor.FA.fetchGearRequests(fa.id);
    },
  },
});
</script>
