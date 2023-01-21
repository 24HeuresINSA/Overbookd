<template>
  <v-autocomplete
    :value="ft"
    :items="FTs"
    :loading="loading"
    chips
    clearable
    item-value="id"
    :item-text="displayFTInformation"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    return-object
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item> Aucune FT correspondante </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { FT, FTStatus } from "~/utils/models/ft";

interface SearchFTData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchFT",
  model: {
    prop: "ft",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher une FT",
    },
    ft: {
      type: Object as () => FT | null,
      default: null,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  data(): SearchFTData {
    return {
      loading: false,
    };
  },
  computed: {
    FTs() {
      return this.$accessor.FT.FTs.filter((ft) => {
        return ft.status === FTStatus.VALIDATED;
      });
    },
  },
  mounted() {
    if (this.FTs.length) return;
    this.$accessor.FT.fetchFTs();
  },
  methods: {
    propagateEvent(ft: FT | null) {
      this.$emit("change", ft);
    },
    displayFTInformation({ id, name }: FT): string {
      return `${id} - ${name}`;
    },
  },
});
</script>
