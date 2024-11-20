<template>
  <v-data-table
    :headers="headers"
    :items="permissions"
    :items-per-page="-1"
    :search="search"
    density="comfortable"
    no-data-text="Aucune permission trouvée"
    :mobile="isMobile"
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Chercher une permission"
        hide-details
      />
    </template>

    <template #item.teams="{ item }">
      <TeamChip
        v-for="team of item.teams"
        :key="team"
        :team="team"
        with-name
        closable
        show-hidden
        @close="revokePermission(item, team)"
      />
    </template>

    <template #item.actions="{ item }">
      <div class="actions">
        <SearchTeam
          label="Lier une équipe"
          hide-details
          clearable
          @update:team="grantPermission(item, $event.code)"
        />
        <v-btn
          icon="mdi-trash-can"
          size="small"
          variant="flat"
          @click="removePermission(item)"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { Permission } from "@overbookd/http";

const permissionStore = usePermissionStore();
const layoutStore = useLayoutStore();

const headers = [
  { title: "Nom", value: "name", width: "25%", sortable: true },
  { title: "Description", value: "description", width: "25%" },
  { title: "Équipes", value: "teams", width: "25%" },
  { title: "Actions", value: "actions", width: "25%" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const search = ref<string>("");

const permissions = computed<Permission[]>(() => permissionStore.permissions);
permissionStore.fetchPermissions();

const removePermission = async (permission: Permission) => {
  await permissionStore.removePermission(permission.id);
};

const revokePermission = async (permission: Permission, teamCode: string) => {
  await permissionStore.revoke(permission.name, teamCode);
};

const grantPermission = async (permission: Permission, teamCode: string) => {
  await permissionStore.grant(permission.name, teamCode);
};
</script>

<style scoped>
.actions {
  display: flex;
  text-align: center;
  align-items: center;
  gap: 5px;
}
</style>
