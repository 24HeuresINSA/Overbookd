<template>
  <DialogCard @close="close">
    <template #title>Créer une nouvelle Fiche Activité</template>
    <template #content>
      <v-text-field
        v-model="name"
        label="Nom de la FA"
        hide-details
        @keydown.enter="createNewActivity"
      />
    </template>
    <template #actions>
      <v-btn
        variant="elevated"
        size="large"
        color="primary"
        text="Créer la Fiche Activité"
        :disabled="canNotCreate"
        @click="createNewActivity"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";

const router = useRouter();
const faStore = useFestivalActivityStore();

const name = ref("");
const selectedActivity = computed<FestivalActivity>(() => {
  return faStore.selectedActivity;
});

const emit = defineEmits(["close"]);
const close = () => emit("close");

const canNotCreate = computed<boolean>(() => name.value === "");
const createNewActivity = async () => {
  if (canNotCreate.value) return;

  const blankFa = { name: name.value };
  await faStore.create(blankFa);

  if (!selectedActivity.value?.id) return;
  router.push({ path: `/fa/${selectedActivity.value.id}` });
  close();
};
</script>
