<template>
  <v-card>
    <v-card-title
      class="pe-2"
      style="display: flex; flex-direction: row; align-items: center"
    >
      Liste des lits
      <v-spacer />
      <v-text-field
        v-model="search"
        density="compact"
        label="Recherche"
        prepend-inner-icon="mdi-magnify"
        flat
        hide-details
        single-line
      />
    </v-card-title>

    <v-card-text>
      <v-data-table
        v-model:search="search"
        :group-by="[
          {
            key: 'bed.room.label',
            order: 'asc',
          },
        ]"
        :items="beds"
        :headers="headers"
        :filter-keys="['sleeper.name']"
        :items-per-page="itemsPerPage"
      >
        <template
          #[`group-header`]="{ item, columns, toggleGroup, isGroupOpen }"
        >
          <tr>
            <td :colspan="columns.length">
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                color="medium-emphasis"
                density="compact"
                size="small"
                variant="outlined"
                @click="toggleGroup(item)"
              />

              <span class="ms-1">{{ item.value }} ({{ roomSizes[item.value].empty }} dispo /
                {{ roomSizes[item.value].total }})</span>
            </td>
          </tr>
        </template>
        <template #[`item.sleeper.wakeupTime`]="{ value }">
          <span v-if="value">
            {{ formatDateWithHoursAndMinutesOnly(value) }}
          </span>
        </template>
        <template #[`item.actions`]="{ item }">
          <BedActionsBtnGroup :bed="item" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { isEmpty, isOccupied, type Bed } from "@overbookd/sleep";
import { formatDateWithHoursAndMinutesOnly } from "@overbookd/time";

const sleepStore = useSleepStore();
const beds = computed<Bed[]>(() => sleepStore.allBeds);

const headers = [
  { title: "Salle", key: "data-table-group" },
  { title: "Lit", key: "bed.label" },
  { title: "Dormeur·euse", key: "sleeper.name" },
  { title: "Réveil", key: "sleeper.wakeupTime" },
  { title: "Note", key: "sleeper.comment" },
  { title: "", key: "actions" },
];

const search = ref("");
const itemsPerPage = ref(-1);

const roomSizes = computed<
  Record<string, { empty: number; occupied: number; total: number }>
>(() => {
  return beds.value.reduce(
    (acc, current) => {
      acc[current.bed.room.label] = {
        empty:
          (acc[current.bed.room.label]?.empty ?? 0) +
          (isEmpty(current) ? 1 : 0),
        occupied:
          (acc[current.bed.room.label]?.occupied ?? 0) +
          (isOccupied(current) ? 1 : 0),
        total: (acc[current.bed.room.label]?.total ?? 0) + 1,
      };
      return acc;
    },
    {} as Record<string, { empty: number; occupied: number; total: number }>,
  );
});
</script>
