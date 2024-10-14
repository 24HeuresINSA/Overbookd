<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="selectedTask.mobilizations"
      :items-per-page="-1"
      :custom-sort="sortMobilizations"
      no-data-text="Aucune mobilisation"
      disable-pagination
      hide-default-footer
    >
      <template #item.start="{ item }">
        {{ formatDateWithMinutes(item.start) }}
      </template>

      <template #item.end="{ item }">
        {{ formatDateWithMinutes(item.end) }}
      </template>

      <template #item.durationSplitInHour="{ item }">
        {{ formatDurationSplitInHour(item.durationSplitInHour) }}
      </template>

      <template #item.volunteers="{ item }">
        <v-chip-group column class="mobilizations__volunteers">
          <VolunteerWithConflictsChip
            v-for="volunteer in item.volunteers"
            :key="`${item.id}-${volunteer.id}`"
            :volunteer="volunteer"
            :disabled="disabled"
            @remove="removeVolunteer(item, volunteer.id)"
          />
          <v-btn
            icon="mdi-plus-thick"
            color="primary"
            size="x-small"
            density="comfortable"
            :disabled="disabled"
            @click="openAddVolunteerDialog(item)"
          />
        </v-chip-group>
      </template>

      <template #item.teams="{ item }">
        <v-chip-group class="mobilizations__teams">
          <TeamChip
            v-for="team in item.teams"
            :key="`${item.id}-${team.team}`"
            :team="team.team"
            :prefix="team.count.toString()"
            with-name
            show-hidden
            :closable="!disabled"
            @close="removeTeam(item, team)"
          />
          <v-btn
            icon="mdi-plus-thick"
            color="primary"
            size="x-small"
            density="comfortable"
            :disabled="disabled"
            @click="openAddTeamDialog(item)"
          />
        </v-chip-group>
      </template>

      <template #item.actions="{ item }">
        <div class="mobilizations__actions">
          <v-btn
            icon="mdi-clock-edit"
            :disabled="disabled"
            size="small"
            density="comfortable"
            @click="openUpdateDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            :disabled="disabled"
            size="small"
            density="comfortable"
            @click="removeMobilization(item)"
          />
        </div>
      </template>
    </v-data-table>

    <v-btn
      text="Ajouter une mobilisation"
      :disabled="disabled"
      color="primary"
      class="mobilizations__add"
      @click="openAddDialog"
    />

    <v-dialog v-model="isAddDialogOpen" max-width="600px">
      <CreateMobilizationDialogCard
        @add="addMobilization"
        @close="closeAddDialog"
      />
    </v-dialog>

    <v-dialog v-model="isUpdateDialogOpen" max-width="600px">
      <UpdateMobilizationPeriodDialogCard
        v-if="selectedMobilization"
        :mobilization="selectedMobilization"
        @update="updateMobilization"
        @close="closeUpdateDialog"
      />
    </v-dialog>

    <v-dialog v-model="isAddVolunteerDialogOpen" max-width="600px">
      <AddVolunteerInMobilizationDialogCard
        v-if="selectedMobilization"
        :mobilization="selectedMobilization"
        @add="addVolunteer"
        @close="closeAddVolunteerDialog"
      />
    </v-dialog>

    <v-dialog v-model="isAddTeamDialogOpen" max-width="600px">
      <AddTeamInMobilizationDialogCard
        v-if="selectedMobilization"
        :mobilization="selectedMobilization"
        @add="addTeam"
        @close="closeAddTeamDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {
  Mobilization,
  UpdateMobilization,
  TeamMobilization,
  Volunteer,
  FestivalTaskWithConflicts,
} from "@overbookd/festival-event";
import { formatDateWithMinutes } from "@overbookd/time";
import type { AddMobilizationForm } from "@overbookd/http";
import {
  type SortablePeriodHeader,
  periodsSorts,
} from "~/utils/sort/sort-period";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const ftStore = useFestivalTaskStore();

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const headers: TableHeaders = [
  { title: "Début", value: "start", sortable: true },
  { title: "Fin", value: "end", sortable: true },
  { title: "Découpage", value: "durationSplitInHour", sortable: true },
  { title: "Bénévoles requis", value: "volunteers" },
  { title: "Equipes requises", value: "teams" },
  { title: "Actions", value: "actions" },
];

const selectedMobilization = ref<Mobilization | undefined>();

const selectedTask = computed<FestivalTaskWithConflicts>(
  () => ftStore.selectedTask,
);

const isAddDialogOpen = ref<boolean>(false);
const isUpdateDialogOpen = ref<boolean>(false);
const isAddVolunteerDialogOpen = ref<boolean>(false);
const isAddTeamDialogOpen = ref<boolean>(false);

const openAddDialog = () => (isAddDialogOpen.value = true);
const closeAddDialog = () => (isAddDialogOpen.value = false);
const openUpdateDialog = (mobilization: Mobilization) => {
  selectedMobilization.value = mobilization;
  isUpdateDialogOpen.value = true;
};
const closeUpdateDialog = () => {
  selectedMobilization.value = undefined;
  isUpdateDialogOpen.value = false;
};
const openAddVolunteerDialog = (mobilization: Mobilization) => {
  selectedMobilization.value = mobilization;
  isAddVolunteerDialogOpen.value = true;
};
const closeAddVolunteerDialog = () => {
  selectedMobilization.value = undefined;
  isAddVolunteerDialogOpen.value = false;
};
const openAddTeamDialog = (mobilization: Mobilization) => {
  selectedMobilization.value = mobilization;
  isAddTeamDialogOpen.value = true;
};
const closeAddTeamDialog = () => {
  selectedMobilization.value = undefined;
  isAddTeamDialogOpen.value = false;
};

const emit = defineEmits(["add", "update", "remove"]);

const addMobilization = (mobilization: AddMobilizationForm) => {
  emit("add", mobilization);
};
const updateMobilization = (
  mobilizationId: Mobilization["id"],
  mobilization: UpdateMobilization,
) => {
  emit("update", mobilizationId, mobilization);
};
const removeMobilization = (mobilization: Mobilization) => {
  emit("remove", mobilization);
};

const addVolunteer = (
  mobilization: Mobilization,
  volunteerId: Volunteer["id"],
) => {
  ftStore.addVolunteerToMobilization(mobilization.id, volunteerId);
};
const removeVolunteer = (
  mobilization: Mobilization,
  volunteerId: Volunteer["id"],
) => {
  ftStore.removeVolunteerFromMobilization(mobilization.id, volunteerId);
};
const addTeam = (mobilization: Mobilization, team: TeamMobilization) => {
  console.log(mobilization, team);
  ftStore.addTeamToMobilization(mobilization.id, team);
  closeAddTeamDialog();
};
const removeTeam = (mobilization: Mobilization, { team }: TeamMobilization) => {
  ftStore.removeTeamFromMobilization(mobilization.id, team);
};

const formatDurationSplitInHour = (duration: number | null): string => {
  return duration ? `${duration}h` : "";
};
const sortMobilizations = (
  mobilizations: Mobilization[],
  sortsBy: SortablePeriodHeader[],
  sortsDesc: boolean[],
) => {
  const sortBy = sortsBy.at(0) ?? "start";
  const sortFnc = periodsSorts.get(sortBy);
  if (!sortFnc) return mobilizations;

  const sortDesc = sortsDesc.at(0) ?? false;
  return sortFnc(mobilizations, sortDesc);
};
</script>

<style lang="scss" scoped>
.mobilizations {
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
  &__teams,
  &__volunteers {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  &__actions {
    display: flex;
    gap: 5px;
  }
}
</style>
