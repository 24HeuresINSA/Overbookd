<template>
  <DialogCard without-actions @close="close">
    <template #title>
      FT avec des bénévoles demandés {{ formattedTeams }}
    </template>

    <template #subtitle>
      <div class="details__subtitle">
        <v-chip color="primary" variant="flat">
          Du {{ formatDateToHumanReadable(details.start) }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          Au {{ formatDateToHumanReadable(details.end) }}
        </v-chip>
      </div>
    </template>

    <template #content>
      <div class="details__content">
        <h3>
          Fiche Tâches
          <v-chip color="secondary" size="small" variant="flat">
            {{ details.tasks.length }}
          </v-chip>
        </h3>
        <ul v-if="details.tasks.length">
          <li v-for="task in details.tasks" :key="task.id">
            <nuxt-link :to="`${FT_URL}/${task.id}`">
              FT #{{ task.id }} - {{ task.name }}
            </nuxt-link>
            <v-chip color="tertiary" size="x-small" class="ml-1">{{
              task.count
            }}</v-chip>
          </li>
        </ul>
        <p v-else>Aucune demande</p>
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { OrgaNeedDetails } from "@overbookd/http";
import { formatDateToHumanReadable } from "@overbookd/time";
import { FT_URL } from "@overbookd/web-page";

const teamStore = useTeamStore();

const props = defineProps({
  details: {
    type: Object as PropType<OrgaNeedDetails>,
    required: true,
  },
  filterTeams: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const close = () => emit("close");

const findTeamName = (code: string) => {
  return teamStore.getTeamByCode(code)?.name || "";
};

const formattedTeams = computed(() => {
  if (props.filterTeams.length === 0) return "";
  return props.filterTeams.map((team) => `(${findTeamName(team)})`).join(", ");
});
</script>

<style lang="scss" scoped>
.details {
  &__subtitle {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  &__content {
    h3 {
      margin-bottom: 5px;
    }
    ul {
      margin-left: 20px;
    }
    li {
      margin-bottom: 2px;
    }
  }
}
</style>
