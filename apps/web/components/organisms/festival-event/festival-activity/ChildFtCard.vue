<template>
  <v-card>
    <v-card-title>FT associées</v-card-title>
    <v-card-text>
      <v-data-table
        class="task__listing"
        :headers="headers"
        :items="selectedActivity.tasks"
        :items-per-page="-1"
        :hide-default-footer="true"
        @click:row="openFt"
        @auxclick:row="openFtInNewTab"
      >
        <template #item.id="{ item }">
          <v-chip small>{{ item.id }}</v-chip>
        </template>
        <template #item.status="{ item }">
          <v-chip-group id="status">
            <v-chip :color="getFtStatus(item.status)" small>
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </v-chip-group>
        </template>
        <template #no-data> Aucune FT associée </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  FestivalActivity,
  FestivalTask,
  FestivalTaskChild,
} from "@overbookd/festival-event";
import { defineComponent } from "vue";
import { BROUILLON } from "~/utils/festival-event/festival-event.model";
import { Header } from "~/utils/models/data-table.model";
import { FtStatusLabel, ftStatusLabels } from "~/utils/models/ft.model";

type ChildFtCardData = {
  headers: Header[];
};

export default defineComponent({
  name: "ChildFtCard",
  data: (): ChildFtCardData => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name", sortable: false },
      { text: "Statut", value: "status", sortable: false },
    ],
  }),
  computed: {
    selectedActivity(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
  },
  methods: {
    getFtStatus(status: FestivalTask["status"]): string {
      return status.toLowerCase();
    },
    getStatusLabel(status: FestivalTask["status"]): FtStatusLabel {
      return ftStatusLabels.get(status) ?? BROUILLON;
    },
    openFt(task: FestivalTaskChild, _: unknown, event: PointerEvent) {
      if (event.ctrlKey) return this.openFtInNewTab(event, { item: task });
      this.$router.push({ path: `/ft/${task.id}` });
    },
    openFtInNewTab(_: Event, { item: ft }: { item: FestivalTaskChild }) {
      const taskRoute = this.$router.resolve({ path: `/ft/${ft.id}` });
      window.open(taskRoute.href, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.task {
  &__listing {
    cursor: pointer;
  }
}
</style>
