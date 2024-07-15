<template>
  <v-data-table
    :headers="headers"
    :items="permissions"
    :items-per-page="-1"
    :search="search"
    class="my-4"
    dense
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Chercher une permission"
        class="mx-4"
      />
    </template>

    <template #item.name="{ item }">
      {{ item.name }}
    </template>

    <template #item.description="{ item }">
      {{ item.description }}
    </template>

    <template #item.teams="{ item }">
      <TeamChip
        v-for="team of item.teams"
        :key="team"
        :team="team"
        with-name
        closable
        show-hidden
        @close="unlinkTeamFromPermission(item, team)"
      />
    </template>

    <template #item.actions="{ item }">
      <div class="actions">
        <SearchTeam
          label="Lier une équipe"
          hide-details
          clearable
          @update:model-value="linkTeamToPermission(item, $event)"
        />
        <v-btn
          icon="mdi-trash-can"
          density="comfortable"
          @click="removePermission(item)"
        />
      </div>
    </template>

    <template #footer.prepend>
      <v-text-field
        v-model="newPermissionName"
        type="text"
        placeholder="Nom"
        class="w-1/3 px-4"
      />
      <v-text-field
        v-model="newPermissionDescription"
        type="text"
        placeholder="Description"
        class="w-1/3 px-4"
      />
      <v-btn color="primary" class="mr-2" @click="addPermission">
        Ajouter une permission
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { Permission } from "@overbookd/http";
import type { Team } from "@overbookd/team";

const permissionStore = usePermissionStore();

const headers = [
  { title: "Nom", value: "name", width: "25%" },
  { title: "Description", value: "description", width: "25%", sortable: false },
  { title: "Équipes", value: "teams", width: "25%", sortable: false },
  { title: "Actions", value: "actions", width: "25%", sortable: false },
];

const search = ref("");
const newPermissionName = ref("");
const newPermissionDescription = ref("");

const permissions = computed(() => permissionStore.permissions);
permissionStore.fetchPermissions();

const addPermission = async () => {
  await permissionStore.createPermission({
    name: newPermissionName.value,
    description: newPermissionDescription.value,
  });
  newPermissionName.value = "";
  newPermissionDescription.value = "";
};
const removePermission = async (permission: Permission) => {
  await permissionStore.removePermission(permission.id);
};

const linkTeamToPermission = async (permission: Permission, team: Team) => {
  const alreadyHasTeam = permission.teams.find(
    (teamCode) => teamCode === team.code,
  );
  if (alreadyHasTeam) {
    return sendFailureNotification(
      "Cette équipe est déjà liée à cette permission",
    );
  }
  const teamCodes = [...permission.teams, team.code];
  await permissionStore.linkTeamsToPermission(permission.id, teamCodes);
};

const unlinkTeamFromPermission = async (
  permission: Permission,
  teamCode: string,
) => {
  const teamCodes = permission.teams.filter((code) => code !== teamCode);
  await permissionStore.linkTeamsToPermission(permission.id, teamCodes);
};
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  text-align: center;
  align-items: center;
  gap: 1rem;
}
</style>
