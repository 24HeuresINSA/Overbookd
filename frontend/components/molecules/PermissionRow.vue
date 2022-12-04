<template>
  <tr>
    <td>{{ permission.name }}</td>
    <td>
      {{ permission.description }}
    </td>
    <td>
      <OverChips :roles="permission.teams" />
    </td>
    <td>
      <div class="d-flex align-center">
        <v-select
          v-model="newElement"
          :items="teams()"
          item-text="name"
          item-value="code"
          label="Team"
        />
        <v-btn fab dark small class="mx-2" @click="addTeam">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
        <v-btn fab dark small class="mx-2" @click="removePermission">
          <v-icon dark> mdi-trash-can </v-icon>
        </v-btn>
      </div>
    </td>
  </tr>
</template>

<script>
import OverChips from "~/components/atoms/overChips";

export default {
  name: "PermissionRow",
  components: {
    OverChips,
  },
  props: {
    permission: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newElement: null,
    };
  },
  methods: {
    teams() {
      return this.$accessor.team.allTeams;
    },
    async addTeam() {
      if (!this.newElement) {
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "Il faut préciser une team !",
        });
        return;
      }
      let teamCodes = [...this.permission.teams];
      if (teamCodes.find((teamCode) => teamCode === this.newElement)) {
        teamCodes = teamCodes.filter(
          (teamCode) => teamCode !== this.newElement
        );
      } else {
        teamCodes.push(this.newElement);
      }
      let response = await this.$accessor.permission.linkPermissionToTeams({
        permissionId: this.permission.id,
        teamCodes: teamCodes,
      });
      if (response.status === 201) {
        this.$accessor.permission.setPermissionsInStore();
      } else {
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "Une erreur est survenue !",
        });
      }
    },
    async removePermission() {
      let response = await this.$accessor.permission.removePermission({
        permissionId: this.permission.id,
      });
      if (response.status === 204) {
        this.$accessor.permission.setPermissionsInStore();
      } else {
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "Une erreur est survenue !",
        });
      }
    },
  },
};
</script>
