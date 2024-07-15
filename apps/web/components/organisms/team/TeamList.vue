<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="teams"
      :items-per-page="-1"
      :search="search"
      dense
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Chercher une équipe"
          class="mx-4"
        />
      </template>

      <template #item.rendering="{ item }">
        <TeamChip :team="item.code" with-name show-hidden />
      </template>

      <template #item.actions="{ item }">
        <div class="actions">
          <v-btn
            icon="mdi-pencil"
            density="comfortable"
            @click="openUpdateTeamDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            density="comfortable"
            @click="openDeleteConfirmationDialog(item)"
          />
        </div>
      </template>

      <template #footer.prepend>
        <v-btn color="primary" class="mr-2" @click="openAddTeamDialog">
          Ajouter une équipe
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="isTeamDialogOpen" width="600px">
      <TeamForm
        :team="selectedTeam"
        @close="closeTeamDialog"
        @create="createTeam"
        @update="updateTeam"
      />
    </v-dialog>

    <v-dialog v-model="isDeleteConfirmationDialogOpen" width="600px">
      <ConfirmationMessage
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
      </ConfirmationMessage>
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

const search = ref("");
const selectedTeam = ref<Team | undefined>(undefined);
const isTeamDialogOpen = ref(false);
const isDeleteConfirmationDialogOpen = ref(false);

const teams = computed(() => teamStore.teams);

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

<style lang="scss" scoped>
.actions {
  display: flex;
  gap: 8px;
}
</style>
