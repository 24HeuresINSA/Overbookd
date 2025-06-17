<template>
  <DesktopPageTitle />
  <v-dialog
    v-model="openEdit"
    width="500"
    @after-leave="sleepStore.clearSelectedBed()"
  >
    <UpdateBedCard v-if="selectedBed" :bed="selectedBed" />
  </v-dialog>
  <div
    style="display: flex; flex-direction: row; justify-content: space-between"
  >
    <div style="display: flex; flex-direction: column; flex: 1">
      <CreateSleeperCard />
      <CreateBedCard />
    </div>
    <div style="flex: 1">
      <BedListCard />
    </div>

    <div style="flex: 1">
      <SleeperCard
        v-for="occupiedBed in beds"
        :key="occupiedBed.id"
        :sleeper="occupiedBed"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bed, OccupiedBed } from "@overbookd/sleep";

useHead({ title: "DodoMaker" });

const userStore = useUserStore();
const sleepStore = useSleepStore();
sleepStore.fetchAll();
userStore.fetchAdherents();
const openEdit = ref(false);

const beds = computed<OccupiedBed[]>(() => sleepStore.allSortedBeds);
const selectedBed = computed<Bed | undefined>(() => sleepStore.selectedBed);
const openModal = computed<boolean>(() => !!selectedBed.value);

watch(
  () => openModal.value,
  (next) => openEdit.value = next;
);
</script>
