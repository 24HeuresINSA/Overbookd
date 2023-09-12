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
          label="Chercher"
          class="mx-4"
        ></v-text-field>
      </template>

      <template #item.rendering="{ item }">
        <TeamChip :team="item.code" with-name show-hidden />
      </template>

      <template #item.actions="{ item }">
        <v-btn icon @click="openUpdateTeamDialog(item)">
          <v-icon> mdi-pencil </v-icon>
        </v-btn>
        <v-btn icon @click="openDeleteConfirmationDialog(item)">
          <v-icon> mdi-trash-can </v-icon>
        </v-btn>
      </template>

      <template #footer.prepend>
        <v-btn color="primary" @click="openAddTeamDialog">
          Ajouter une équipe
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="isTeamDialogOpen" width="600px">
      <TeamForm
        :team="selectedTeam"
        @close-dialog="closeTeamDialog"
        @create="createTeam"
        @update="updateTeam"
      />
    </v-dialog>

    <v-dialog v-model="isDeleteConfirmationDialogOpen" width="600px">
      <ConfirmationMessage
        confirm-color="error"
        @close-dialog="closeDeleteConfirmationDialog"
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

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import { Team } from "~/utils/models/team.model";
import { Header } from "~/utils/models/data-table.model";
import TeamForm from "~/components/molecules/team/TeamForm.vue";

interface TeamsCardData {
  search: string;
  headers: Header[];
  selectedTeam: Team | null;
  isTeamDialogOpen: boolean;
  isDeleteConfirmationDialogOpen: boolean;
}

export default Vue.extend({
  name: "TeamsCard",
  components: { TeamChip, ConfirmationMessage, TeamForm },
  data: (): TeamsCardData => ({
    headers: [
      {
        text: "Nom",
        value: "name",
        width: "30%",
      },
      {
        text: "Code",
        value: "code",
        width: "25%",
      },
      {
        text: "Rendu",
        value: "rendering",
        width: "25%",
      },
      {
        text: "Modifier/Supprimer",
        value: "actions",
        width: "20%",
      },
    ],
    search: "",
    selectedTeam: null,
    isTeamDialogOpen: false,
    isDeleteConfirmationDialogOpen: false,
  }),
  computed: {
    teams(): Team[] {
      return this.$accessor.team.allTeams;
    },
  },
  async mounted() {
    if (this.$accessor.team.allTeams.length === 0) {
      await this.$accessor.team.fetchTeams();
    }
  },
  methods: {
    async createTeam(team: Team) {
      await this.$accessor.team.createTeam(team);
    },
    async updateTeam(team: Team) {
      await this.$accessor.team.updateTeam(team);
    },
    async removeSelectedTeam() {
      if (!this.selectedTeam) return;
      await this.$accessor.team.removeTeam(this.selectedTeam);
    },
    openAddTeamDialog() {
      this.selectedTeam = null;
      this.isTeamDialogOpen = true;
    },
    openUpdateTeamDialog(team: Team) {
      this.selectedTeam = team;
      this.isTeamDialogOpen = true;
    },
    closeTeamDialog() {
      this.selectedTeam = null;
      this.isTeamDialogOpen = false;
    },
    openDeleteConfirmationDialog(team: Team) {
      this.selectedTeam = team;
      this.isDeleteConfirmationDialogOpen = true;
    },
    closeDeleteConfirmationDialog() {
      this.selectedTeam = null;
      this.isDeleteConfirmationDialogOpen = false;
    },
  },
});
</script>
