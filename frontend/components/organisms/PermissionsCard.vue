<template>
  <div class="my-4">
    <h2>Permissions</h2>
    <v-data-table
      :headers="headers"
      :items="permissions()"
      :items-per-page="5"
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
      <template #body="{ items }">
        <tbody>
          <PermissionRow
            v-for="item in items"
            :key="item.id"
            :permission="item"
          />
        </tbody>
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
        <v-btn
          color="primary"
          dark
          class="ma-2 w-1/3 px-4"
          @click="addPermission"
        >
          Ajouter une permission
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { permission } from "~/utils/models/repo";
import PermissionRow from "~/components/molecules/PermissionRow.vue";

export default Vue.extend({
  name: "PermissionCard",
  components: {
    PermissionRow,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Nom",
          value: "name",
          width: "25%",
        },
        {
          text: "Description",
          value: "description",
          width: "25%",
        },
        {
          text: "Équipes",
          value: "teams",
          width: "25%",
        },
        {
          text: "Ajouter/Retirer",
          value: "action",
          width: "25%",
        },
      ],
      newPermissionName: "",
      newPermissionDescription: "",
    };
  },
  async mounted() {
    if (this.$accessor.permission.allPermissions.length === 0) {
      await this.$accessor.permission.setPermissionsInStore();
    }
  },
  methods: {
    permissions(): permission[] {
      return this.$accessor.permission.allPermissions;
    },
    async addPermission() {
      let response = await this.$accessor.permission.createPermission({
        name: this.newPermissionName,
        description: this.newPermissionDescription,
      });
      if (response) {
        this.newPermissionName = "";
        this.newPermissionDescription = "";
        this.$accessor.permission.setPermissionsInStore();
      }
    },
  },
});
</script>
