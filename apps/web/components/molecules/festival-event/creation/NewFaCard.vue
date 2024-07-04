<template>
  <v-card>
    <v-card-title>Créer une nouvelle Fiche Activité</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="name"
        label="Nom de la FA"
        hide-details
        @keydown.enter="createNewActivity"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        variant="elevated"
        size="large"
        color="primary"
        text="Créer la Fiche Activité"
        :disabled="canNotCreate"
        @click="createNewActivity"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";

const router = useRouter();
const faStore = useFestivalActivityStore();

const emit = defineEmits(["close"]);

const name = ref("");
const selectedActivity = computed<FestivalActivity>(() => {
  return faStore.selectedActivity;
});

const canNotCreate = computed<boolean>(() => name.value === "");
const createNewActivity = async () => {
  if (canNotCreate.value) return;

  const blankFa = { name: name.value };
  await faStore.create(blankFa);

  if (!selectedActivity.value?.id) return;
  router.push({ path: `/fa/${selectedActivity.value.id}` });
  emit("close");
};
</script>
