<template>
  <div>
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
            v-for="(item, index) in items"
            :key="index"
            :permission="item"
          />
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import PermissionRow from "~/components/molecules/PermissionRow";

export default {
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
    };
  },
  methods: {
    permissions() {
      return this.$accessor.permission.allPermissions;
    },
  },
};
</script>
