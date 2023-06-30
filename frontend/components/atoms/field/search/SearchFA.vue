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
    :disabled="disabled"
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
import { FaSimplified } from "~/utils/models/fa";

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
      type: Object as () => FaSimplified | null,
      default: () => null,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(): SearchFAData {
    return {
      loading: false,
    };
  },
  computed: {
    FAs() {
      return this.$accessor.FA.FAs;
    },
  },
  mounted() {
    if (this.FAs.length) return;
    this.$accessor.FA.fetchFAs();
  },
  methods: {
    propagateEvent(fa: FaSimplified | null) {
      this.$emit("change", fa);
    },
    displayFAInformation({ id, name }: FaSimplified): string {
      return `${id} - ${name}`;
    },
  },
});
</script>
