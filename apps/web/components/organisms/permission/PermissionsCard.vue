<template>
  <div class="my-4">
    <v-data-table
      :headers="headers"
      :items="permissions"
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
import { Permission } from "@overbookd/http";
import Vue from "vue";
import PermissionRow from "~/components/molecules/permission/PermissionRow.vue";

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
  computed: {
    permissions(): Permission[] {
      return this.$accessor.permission.allPermissions;
    },
  },
  async mounted() {
    if (this.$accessor.permission.allPermissions.length === 0) {
      await this.$accessor.permission.fetchPermissions();
    }
  },
  methods: {
    async addPermission() {
      await this.$accessor.permission.createPermission({
        name: this.newPermissionName,
        description: this.newPermissionDescription,
      });
      this.newPermissionName = "";
      this.newPermissionDescription = "";
    },
  },
});
</script>
