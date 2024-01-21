<template>
  <v-autocomplete
    :value="fa"
    :items="fas"
    :loading="loading"
    chips
    clearable
    item-value="id"
    :item-text="displayFaInformation"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    :filter="matchingFa"
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
import { PreviewFestivalActivity } from "@overbookd/festival-event";
import { SlugifyService } from "@overbookd/slugify";

type MinimalFa = Pick<PreviewFestivalActivity, "id" | "name">;

type SearchFaData = {
  loading: boolean;
};

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
      type: Object as () => MinimalFa | null,
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
    fas(): PreviewFestivalActivity[] {
      return this.$accessor.festivalActivity.activities.forAll;
    },
  },
  async mounted() {
    if (this.fas.length) return;
    this.loading = true;
    await this.$accessor.festivalActivity.fetchAllActivities();
    this.loading = false;
  },
  methods: {
    propagateEvent(fa: PreviewFestivalActivity | null) {
      this.$emit("change", fa);
    },
    matchingFa(fa: PreviewFestivalActivity, queryText: string | null) {
      if (queryText === null) return true;
      const search = SlugifyService.apply(queryText);
      const searchable = SlugifyService.apply(`${fa.id} ${fa.name}`);
      return searchable.includes(search);
    },
    displayFaInformation({ id, name }: PreviewFestivalActivity): string {
      return `${id} - ${name}`;
    },
  },
});
</script>
