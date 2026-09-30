<template>
  <v-data-table
    :headers="headers"
    :items="stats"
    :items-per-page="-1"
    :search="search"
    density="comfortable"
    no-data-text="Aucune statistique trouvée"
    :mobile="isMobile"
  >
    <template #top>
      <v-text-field v-model="search" label="Chercher une équipe" hide-details />
    </template>
    <template #item.delete="{ item }">
      <v-btn
        icon="mdi-trash-can"
        aria-label="Supprimer la stat"
        title="Supprimer la stat"
        size="small"
        variant="flat"
        @click="removeStat(item)"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { FestivalEventStatConfigValue } from "@overbookd/configuration";

const layoutStore = useLayoutStore();
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const { stats } = defineProps({
  stats: {
    type: Array as PropType<FestivalEventStatConfigValue[]>,
    required: true,
  },
});

const headers = [
  { title: "Equipe", value: "code", sortable: true },
  { title: "Validées", value: "count", sortable: true },
  { title: "Supprimer", value: "delete" },
];
const search = ref<string>("");

const emit = defineEmits(["remove"]);
const removeStat = async (stat: FestivalEventStatConfigValue) =>
  emit("remove", stat);
</script>
