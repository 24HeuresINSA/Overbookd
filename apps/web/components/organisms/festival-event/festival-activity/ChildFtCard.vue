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
        :hover="selectedActivity.tasks.length > 0"
        :mobile="isMobile"
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
import { BROUILLON } from "~/utils/festival-event/festival-event.constant";
import {
  type FtStatusLabel,
  ftStatusLabels,
} from "~/utils/festival-event/festival-task/festival-task.model";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { openTask, openTaskInNewTab } from "~/utils/festival-event/open-page";

const faStore = useFestivalActivityStore();
const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Numéro", value: "id", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Statut", value: "status", sortable: true },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);

const getStatusColor = ({ status }: FestivalTaskChild): string => {
  return status.toLowerCase();
};
const getStatusLabel = ({ status }: FestivalTaskChild): FtStatusLabel => {
  return ftStatusLabels.get(status) ?? BROUILLON;
};
</script>
