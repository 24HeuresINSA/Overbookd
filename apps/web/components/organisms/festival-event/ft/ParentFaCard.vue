<template>
  <v-card :class="validationStatus">
    <CardErrorList festival-event="FT" :type="cardType" />
    <v-card-title>FA associée</v-card-title>
    <v-card-text>
      <SearchFa
        :fa="mFT.fa"
        label="FA associée"
        :boxed="false"
        :disabled="isValidatedByOwner"
        @change="updateParentFA($event)"
      ></SearchFa>
      <CompleteLogisticsTable v-if="mFT.fa" class="elevation-1" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchFa from "~/components/atoms/field/search/SearchFa.vue";
import CompleteLogisticsTable from "~/components/molecules/festival-event/logistic/CompleteLogisticsTable.vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import {
  getFTValidationStatus,
  isTaskValidatedBy,
} from "~/utils/festival-event/ftUtils";
import { BaseFa } from "~/utils/models/fa";
import { Ft, FtCardType } from "~/utils/models/ft";

export default Vue.extend({
  name: "ParentFaCard",
  components: { SearchFa, CompleteLogisticsTable, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: FtCardType.PARENT_FA,
  }),
  computed: {
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
    isValidatedByOwner(): boolean {
      return isTaskValidatedBy(this.mFT.reviews, this.owner);
    },
    validationStatus(): string {
      return getFTValidationStatus(this.mFT, this.owner).toLowerCase();
    },
  },
  methods: {
    updateParentFA(fa: BaseFa | null) {
      const updatedFT = { ...this.mFT, fa: fa ?? undefined };
      this.$accessor.ft.updateFT(updatedFT);
      if (fa) this.$accessor.fa.fetchGearRequests(fa.id);
    },
  },
});
</script>
