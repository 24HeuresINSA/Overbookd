<template>
  <v-autocomplete
    :value="signage"
    :items="filteredSignages"
    :loading="loading"
    item-text="name"
    :chips="chips"
    :clearable="clearable"
    :filled="boxed"
    item-value="id"
    :label="label"
    :solo="boxed"
    return-object
    :dense="dense"
    :hide-details="dense"
    @update:search-input="searchSignage"
    @change="propagateEvent"
    @focus="initList"
  >
    <template #item="{ item }">
      {{ item.name }}
    </template>
    <template #no-data>
      <v-list-item> Aucune signalétique correspondante </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SignageType, Signage } from "@overbookd/signa";

interface SearchSignageData {
  loading: boolean;
  search: string;
}

export default defineComponent({
  name: "SearchSignage",
  model: {
    prop: "signage",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher une signalétique",
    },
    signage: {
      type: Object,
      default: undefined,
    },
    type: {
      type: String as () => SignageType | undefined,
      default: undefined,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    chips: {
      type: Boolean,
      default: false,
    },
  },
  data: (): SearchSignageData => ({
    loading: false,
    search: "",
  }),
  computed: {
    signages(): Signage[] {
      const allSignages = this.$accessor.catalogSignage.signages;
      if (!this.type) return allSignages;

      return this.$accessor.catalogSignage.signages.reduce(
        (acc: Signage[], signage: Signage) => {
          if (this.type && signage.type !== this.type) return acc;
          return [...acc, signage];
        },
        [],
      );
    },
    filteredSignages(): Signage[] {
      return this.signages.filter((signage) => {
        return signage.name.includes(this.search);
      });
    },
  },
  methods: {
    searchSignage(signageName: string | null) {
      if (signageName && signageName.length < 3) return;
      this.search = signageName || "";
    },
    async initList() {
      this.loading = true;
      await this.$accessor.catalogSignage.fetchSignages();
      this.loading = false;
    },
    propagateEvent(signage: Signage) {
      this.$emit("change", signage);
    },
  },
});
</script>
