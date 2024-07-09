<template>
  <v-card>
    <v-card-title>FT associées</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="selectedActivity.tasks"
        :items-per-page="-1"
        hide-default-footer
        no-data-text="Aucune FT associée"
        hover
        @click:row="openTask"
        @auxclick:row="openTaskInNewTab"
      >
        <template #item.id="{ item }">
          <v-chip size="small">{{ item.id }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip-group id="status">
            <v-chip :color="getStatusColor(item)" size="small">
              {{ getStatusLabel(item) }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type {
  FestivalActivity,
  FestivalTaskChild,
} from "@overbookd/festival-event";
import { BROUILLON } from "~/utils/festival-event/festival-event.model";
import {
  type FtStatusLabel,
  ftStatusLabels,
} from "~/utils/festival-event/festival-task/festival-task.model";
import type { TableHeaders } from "~/utils/data-table/header";

const router = useRouter();
const faStore = useFestivalActivityStore();

const headers: TableHeaders = [
  { title: "Numéro", value: "id", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Statut", value: "status", sortable: true },
];

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);

const getStatusColor = ({ status }: FestivalTaskChild): string => {
  return status.toLowerCase();
};
const getStatusLabel = ({ status }: FestivalTaskChild): FtStatusLabel => {
  return ftStatusLabels.get(status) ?? BROUILLON;
};

const openTaskInNewTab = (
  _: PointerEvent,
  target: { item: FestivalTaskChild },
) => {
  const { id } = { ...target.item };
  const activityRoute = router.resolve({ path: `/ft/${id}` });
  window.open(activityRoute.href, "_blank");
};
const openTask = (event: PointerEvent, target: { item: FestivalTaskChild }) => {
  if (event.ctrlKey) return openTaskInNewTab(event, target);
  const { id } = { ...target.item };
  router.push({ path: `/ft/${id}` });
};
</script>
