<template>
  <DialogCard @close="close">
    <template #title>Créer une nouvelle Fiche Tâche</template>
    <template #content>
      <v-text-field v-model="name" label="Nom de la FT" />
      <SearchFestivalActivity v-model="selectedActivity" label="FA associée" />
    </template>
    <template #actions>
      <v-btn
        text="Créer la Fiche Tâche"
        size="large"
        :disabled="cantCreate"
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

const router = useRouter();
const ftStore = useFestivalTaskStore();

type MinimalActivity = Pick<PreviewFestivalActivity, "id" | "name">;

const name = ref<string>("");
const selectedActivity = ref<MinimalActivity | null>(null);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const cantCreate = computed<boolean>(
  () => name.value.trim() === "" || !selectedActivity.value,
);
const selectedTask = computed<FestivalTask>(() => {
  return ftStore.selectedTask;
});
const createNewTask = async () => {
  if (cantCreate.value || !selectedActivity.value) return;

  const blankFt = {
    name: name.value,
    festivalActivityId: selectedActivity.value.id,
  };
  await ftStore.create(blankFt);

  if (!selectedTask.value?.id) return;
  router.push({ path: `/ft/${selectedTask.value.id}` });
  close();
};
</script>
