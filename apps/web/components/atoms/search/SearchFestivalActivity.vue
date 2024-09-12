<template>
  <v-autocomplete
    v-model="activity"
    :items="activities"
    :loading="loading"
    item-value="id"
    :item-title="displayActivityInformation"
    :label="label"
    :disabled="disabled"
    no-data-text="Aucune FA correspondante"
    :custom-filter="slugifiedFilter"
    return-object
    chips
  />
</template>

<script lang="ts" setup>
import type { PreviewFestivalActivity } from "@overbookd/festival-event";
import { slugifiedFilter } from "~/utils/search/search.utils";

const faStore = useFestivalActivityStore();

type MinimalActivity = Pick<PreviewFestivalActivity, "id" | "name">;

const activities = computed<MinimalActivity[]>(() => faStore.activities.forAll);
const loading = ref<boolean>(activities.value.length === 0);
faStore.fetchAllActivities().then(() => (loading.value = false));

const activity = defineModel<MinimalActivity | null>({ required: true });

defineProps({
  label: {
    type: String,
    default: "Chercher une FA",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const displayActivityInformation = ({ id, name }: MinimalActivity) => {
  return `${id} - ${name}`;
};
</script>
