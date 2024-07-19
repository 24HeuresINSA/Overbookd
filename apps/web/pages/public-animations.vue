<template>
  <v-data-table
    :headers="tableHeaders"
    :items="animations"
    :loading="loading"
    loading-text="Chargement des animations à publier..."
    no-data-text="Aucune animation à publier"
    :hover="animations.length > 0"
    class="fa"
    @click:row="openActivity"
    @auxclick:row="openActivityInNewTab"
  >
    <template #item.id="{ item }">
      <div class="status">
        <v-chip :class="item.status.toLowerCase()">
          {{ item.id }}
        </v-chip>
      </div>
    </template>

    <template #item.photoLink="{ item }">
      <v-tooltip v-if="item.photoLink" location="top">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-camera"
            size="large"
            variant="flat"
            density="comfortable"
            @click.stop="openPhotoLinkInNewTab(item.photoLink)"
          />
        </template>
        {{ item.photoLink }}
      </v-tooltip>
    </template>

    <template #item.description="{ item }">
      <div v-html-safe="item.description" />
    </template>

    <template #item.categories="{ item }">
      <div class="chips">
        <v-chip v-for="category in item.categories" :key="category">
          {{ category }}
        </v-chip>
      </div>
    </template>

    <template #item.isFlagship="{ item }">
      <v-icon
        v-if="item.isFlagship"
        color="green"
        size="large"
        title="Animation phare"
      >
        mdi-check-circle
      </v-icon>
      <v-icon v-else color="red" size="large" title="Animation non phare">
        mdi-close-circle
      </v-icon>
    </template>

    <template #item.timeWindows="{ item }">
      <div class="chips">
        <v-chip
          v-for="timeWindow in sortTimeWindows(item.timeWindows)"
          :key="timeWindow.id"
        >
          {{ formatDateWithMinutes(timeWindow.start) }} -
          {{ formatDateWithMinutes(timeWindow.end) }}
        </v-chip>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { PreviewForCommunication } from "@overbookd/http";
import type { TimeWindow } from "@overbookd/festival-event";
import { Period } from "@overbookd/period";
import type { TableHeaders } from "~/utils/data-table/header";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import {
  openActivity,
  openActivityInNewTab,
} from "~/utils/festival-event/festival-activity/open-activity";

useHead({ title: "Animations à publier" });

const faStore = useFestivalActivityStore();

const tableHeaders: TableHeaders = [
  {
    title: "Statut",
    value: "id",
    sortable: true,
  },
  {
    title: "Name",
    value: "name",
    sortable: true,
  },
  {
    title: "Photo",
    value: "photoLink",
    align: "center",
    width: "80px",
  },
  { title: "Description", value: "description" },
  { title: "Catégories", value: "categories" },
  {
    title: "Anim phare",
    value: "isFlagship",
    align: "center",
    width: "80px",
  },
  { title: "Créneaux", value: "timeWindows" },
];

const animations = computed<PreviewForCommunication[]>(() => {
  return faStore.activities.forCommunication;
});
const loading = ref<boolean>(animations.value.length === 0);
faStore.fetchCommunicationPreviews().then(() => (loading.value = false));

const sortTimeWindows = (timeWindows: TimeWindow[]): TimeWindow[] => {
  return Period.sort([...timeWindows]);
};

const openPhotoLinkInNewTab = (photoLink: string) => {
  window.open(photoLink, "_blank");
};
</script>

<style lang="scss" scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin: 3px 0;
}
</style>
