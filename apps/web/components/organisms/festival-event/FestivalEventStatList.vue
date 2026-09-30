<template>
  <v-data-table
    :headers="headers"
    :items="stats"
    :items-per-page="-1"
    :search="search"
    density="compact"
    no-data-text="Aucune statistique trouvée"
    :mobile="isMobile"
    hide-default-footer
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Chercher une équipe"
        density="compact"
        hide-details
      />
    </template>
    <template #item.code="{ item }">
      <TeamChip v-if="getTeamByCode(item.code)" :team="item.code" with-name />
      <span v-else>{{ item.code }}</span>
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
import type { FestivalEventIdentifier } from "@overbookd/festival-event";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";

const { getTeamByCode } = useTeamStore();
const layoutStore = useLayoutStore();
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const { stats, festivalEvent } = defineProps({
  stats: {
    type: Array as PropType<FestivalEventStatConfigValue[]>,
    required: true,
  },
  festivalEvent: {
    type: String as PropType<FestivalEventIdentifier>,
    default: "FA",
  },
});

const headers = [
  { title: "Equipe", value: "code", sortable: true },
  { title: `${festivalEvent} validées`, value: "count", sortable: true },
  { title: "Supprimer", value: "delete" },
];
const search = ref<string>("");

const emit = defineEmits(["remove"]);
const removeStat = async (stat: FestivalEventStatConfigValue) =>
  emit("remove", stat);
</script>
