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
        text="Créer la Fiche Activité"
        size="large"
        :disabled="cantCreate"
        :loading="loading"
        rounded
        @click="createNewActivity"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";
import { FA_URL } from "@overbookd/web-page";

const router = useRouter();
const faStore = useFestivalActivityStore();

const name = ref<string>("");
const loading = ref<boolean>(false);

const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
  loading.value = false;
};

const cantCreate = computed<boolean>(
  () => name.value.trim() === "" || loading.value,
);
const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const createNewActivity = async () => {
  if (cantCreate.value) return;
  loading.value = true;

  const blankFa = { name: name.value };
  await faStore.create(blankFa);

  if (!selectedActivity.value?.id) return;
  await router.push(`${FA_URL}/${selectedActivity.value.id}`);
  close();
};
</script>
