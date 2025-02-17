<template>
  <DialogCard @close="close">
    <template #title>Créer une nouvelle Fiche Tâche</template>
    <template #content>
      <v-text-field
        v-model="name"
        label="Nom de la FT"
        @keydown.enter="createNewTask"
      />
      <SearchFestivalActivity
        v-model="selectedActivity"
        label="FA associée"
        @keydown.enter="createNewTask"
      />
    </template>
    <template #actions>
      <v-btn
        text="Créer la Fiche Tâche"
        size="large"
        :disabled="cantCreate"
        :loading="loading"
        rounded
        @click="createNewTask"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type {
  FestivalTask,
  PreviewFestivalActivity,
} from "@overbookd/festival-event";
import { FT_URL } from "@overbookd/web-page";

const ftStore = useFestivalTaskStore();

type MinimalActivity = Pick<PreviewFestivalActivity, "id" | "name">;

const name = ref<string>("");
const selectedActivity = ref<MinimalActivity | null>(null);
const loading = ref<boolean>(false);

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
  loading.value = false;
};

const cantCreate = computed<boolean>(
  () => name.value.trim() === "" || !selectedActivity.value || loading.value,
);
const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const createNewTask = async () => {
  if (cantCreate.value || !selectedActivity.value) return;
  loading.value = true;

  const blankFt = {
    name: name.value,
    festivalActivityId: selectedActivity.value.id,
  };
  await ftStore.create(blankFt);

  if (!selectedTask.value?.id) return;
  await navigateTo(`${FT_URL}/${selectedTask.value.id}`);
  close();
};
</script>
