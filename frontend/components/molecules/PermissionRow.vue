<template>
  <tr>
    <td>{{ permission.name }}</td>
    <td>
      <div
        v-if="!displayDescriptionUpdate"
        class="row-pointer"
        @click="displayDescriptionUpdate = true"
      >
        {{ permission.description }} <v-icon dark small> mdi-pencil </v-icon>
      </div>
      <div v-else class="d-flex" style="min-width: 400px">
        <v-text-field v-model="newDescription" label="Description" />
        <v-icon dark small class="row-pointer" @click="updateDescription">
          mdi-pencil
        </v-icon>
      </div>
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
        <v-btn fab dark small class="mx-2" @click="addOrRemoveTeam">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
        <v-btn fab dark small class="mx-2" @click="removePermission">
          <v-icon dark> mdi-trash-can </v-icon>
        </v-btn>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import { team } from "~/utils/models/repo";
import OverChips from "~/components/atoms/overChips.vue";

export default Vue.extend({
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
      newDescription: this.permission.description,
      displayDescriptionUpdate: false,
    };
  },
  methods: {
    teams(): team[] {
      return this.$accessor.team.allTeams;
    },
    async addOrRemoveTeam() {
      if (!this.newElement) {
        this.$accessor.notif.pushNotification({
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
      await this.$accessor.permission.linkPermissionToTeams({
        permissionId: this.permission.id,
        teamCodes: teamCodes,
      });
    },
    async updateDescription() {
      await this.$accessor.permission.updatePermission({
        id: this.permission.id,
        name: this.permission.name,
        description: this.newDescription,
      });
      this.displayDescriptionUpdate = false;
    },
    async removePermission() {
      await this.$accessor.permission.removePermission({
        permissionId: this.permission.id,
      });
    },
  },
});
</script>
