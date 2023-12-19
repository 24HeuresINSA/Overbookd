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
    :readonly="readonly"
    @update:search-input="searchSignage"
    @change="propagateEvent"
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
import { SlugifyService } from "@overbookd/slugify";

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
      type: Object as () => Signage | undefined,
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
    readonly: {
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

      return this.$accessor.catalogSignage.signages.filter(
        ({ type }) => type === this.type,
      );
    },
    filteredSignages(): Signage[] {
      const search = SlugifyService.apply(this.search);
      return this.signages.filter((signage) => {
        return signage.slug.includes(search);
      });
    },
  },
  async mounted() {
    this.loading = true;
    await this.$accessor.catalogSignage.fetchSignages();
    this.loading = false;
  },
  methods: {
    searchSignage(signageName: string | null) {
      this.search = signageName || "";
    },
    propagateEvent(signage: Signage) {
      this.$emit("change", signage);
    },
  },
});
</script>
