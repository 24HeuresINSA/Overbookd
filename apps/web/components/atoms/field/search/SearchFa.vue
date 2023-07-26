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
import { BaseFa } from "~/utils/models/fa";

interface SearchFaData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchFa",
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
      type: Object as () => BaseFa | null,
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
  data(): SearchFaData {
    return {
      loading: false,
    };
  },
  computed: {
    FAs() {
      return this.$accessor.fa.FAs;
    },
  },
  mounted() {
    if (this.FAs.length) return;
    this.$accessor.fa.fetchFAs();
  },
  methods: {
    propagateEvent(fa: BaseFa | null) {
      this.$emit("change", fa);
    },
    displayFAInformation({ id, name }: BaseFa): string {
      return `${id} - ${name}`;
    },
  },
});
</script>
