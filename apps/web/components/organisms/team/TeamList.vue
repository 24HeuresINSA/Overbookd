<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="teams"
      :items-per-page="-1"
      :search="search"
      density="comfortable"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Chercher une équipe"
          hide-details
        />
      </template>

      <template #item.rendering="{ item }">
        <TeamChip :team="item.code" with-name show-hidden />
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="flat"
          @click="openUpdateTeamDialog(item)"
        />
        <v-btn
          icon="mdi-trash-can"
          size="small"
          variant="flat"
          @click="openDeleteConfirmationDialog(item)"
        />
      </template>

      <template #footer.prepend>
        <v-btn
          text="Ajouter une équipe"
          color="primary"
          class="mr-3"
          @click="openAddTeamDialog"
        />
      </template>
    </v-data-table>

    <v-dialog v-model="isTeamDialogOpen" width="600px">
      <TeamFormDialogCard
        :team="selectedTeam"
        @close="closeTeamDialog"
        @create="createTeam"
        @update="updateTeam"
      />
    </v-dialog>

    <v-dialog v-model="isDeleteConfirmationDialogOpen" width="600px">
      <ConfirmationDialogCard
        confirm-color="error"
        @close="closeDeleteConfirmationDialog"
        @confirm="removeSelectedTeam"
      >
        <template #title>
          Supprimer l'équipe {{ selectedTeam?.name }}
        </template>
        <template #statement>
          Cette équipe sera supprimée DEFINITIVEMENT !!! <br />
          Vérifie bien que tu ne te trompes pas d'équipe.
        </template>
      </ConfirmationDialogCard>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";

const teamStore = useTeamStore();

const headers = [
  { title: "Nom", value: "name", width: "30%" },
  { title: "Code", value: "code", width: "25%" },
  { title: "Rendu", value: "rendering", width: "25%", sortable: false },
  {
    title: "Modifier/Supprimer",
    value: "actions",
    width: "20%",
    sortable: false,
  },
];

const search = ref<string>("");
const selectedTeam = ref<Team | undefined>(undefined);
const isTeamDialogOpen = ref<boolean>(false);
const isDeleteConfirmationDialogOpen = ref<boolean>(false);

const teams = computed<Team[]>(() => teamStore.teams);

const createTeam = async (team: Team) => {
  await teamStore.createTeam(team);
};
const updateTeam = async (team: Team) => {
  await teamStore.updateTeam(team);
};
const removeSelectedTeam = async () => {
  if (!selectedTeam.value) return;
  await teamStore.removeTeam(selectedTeam.value);
};

const openAddTeamDialog = () => {
  selectedTeam.value = undefined;
  isTeamDialogOpen.value = true;
};
const openUpdateTeamDialog = (team: Team) => {
  selectedTeam.value = team;
  isTeamDialogOpen.value = true;
};
const closeTeamDialog = () => {
  selectedTeam.value = undefined;
  isTeamDialogOpen.value = false;
};

const openDeleteConfirmationDialog = (team: Team) => {
  selectedTeam.value = team;
  isDeleteConfirmationDialogOpen.value = true;
};
const closeDeleteConfirmationDialog = () => {
  selectedTeam.value = undefined;
  isDeleteConfirmationDialogOpen.value = false;
};
</script>
