<template>
  <v-autocomplete
    :value="fa"
    :items="FAs"
    :loading="loading"
    chips
    clearable
    item-value="id"
    :item-text="displayFAInformation"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    return-object
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item> Aucune FA correspondante </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { FA, Status } from "~/utils/models/FA";

interface SearchFAData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchFA",
  model: {
    prop: "fa",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher une FA",
    },
    fa: {
      type: Object as () => FA | null,
      default: null,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  data(): SearchFAData {
    return {
      loading: false,
    };
  },
  computed: {
    FAs() {
      return this.$accessor.FA.FAs.filter((fa) => {
        return fa.status === Status.VALIDATED;
      });
    },
  },
  mounted() {
    if (this.FAs.length) return;
    this.$accessor.FA.fetchFAs();
  },
  methods: {
    propagateEvent(fa: FA | null) {
      this.$emit("change", fa);
    },
    displayFAInformation({ id, name }: FA): string {
      return `${id} - ${name}`;
    },
  },
});
</script>
