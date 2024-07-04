<template>
  <h1>FA #{{ activityIdFromUrl }} - {{ selectedActivity.general.name }}</h1>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";

const route = useRoute();
const router = useRouter();
const faStore = useFestivalActivityStore();

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const activityIdFromUrl = computed<number>(() => +route.params.id);

await faStore.fetchActivity(activityIdFromUrl.value);
if (selectedActivity.value.id !== activityIdFromUrl.value) {
  router.push({ path: "/fa" });
}

useHead({
  title: `FA ${selectedActivity.value.id} - ${selectedActivity.value.general.name}`,
});
</script>
