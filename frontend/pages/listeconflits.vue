<template>
  <div>
    <v-btn v-if="hasPermission('can-affect')" @click="recomputeAllConflicts">
      Recalculer tous les conflits [humain]
    </v-btn>
    <br />
    <p>
      Nombre de conflits : <b>{{ nbConflits }}</b>
    </p>
    <v-simple-table dense>
      <template #default>
        <thead>
          <tr>
            <th>Qui ?</th>
            <th>Type</th>
            <th>FT1</th>
            <th>FT2</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="conflict in conflictsbyUser"
            :key="`${conflict.user.id}-${conflict.ft1}-${conflict.ft2}`"
          >
            <td>{{ conflict.user.firstname }} {{ conflict.user.lastname }}</td>
            <td>{{ conflictTypeText(conflict.type) }}</td>
            <td>
              <a :href="`/ft/${conflict.ft1}`">{{ conflict.ft1 }}</a>
            </td>
            <td>
              <a :href="`/ft/${conflict.ft2}`">{{ conflict.ft2 }}</a>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Conflict } from "~/utils/models/conflicts";

declare type ConflictFT = Conflict & {
  ft1: number;
  ft2: number;
};

export default Vue.extend({
  computed: {
    conflictsbyUser(): ConflictFT[] {
      return this.$accessor.conflict.sortedByUser() as unknown as ConflictFT[];
    },
    nbConflits(): number {
      return this.$accessor.conflict.conflicts.length;
    },
  },
  async mounted() {
    if (this.hasPermission("hard")) {
      await this.initStore();
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },
  methods: {
    async initStore() {
      await this.$accessor.conflict.fetchAll();
    },
    conflictTypeText(type: string) {
      switch (type) {
        case "TF":
          return "Auto Assignation";
        case "TS":
          return "Assignation Manuelle";
        case "availability":
          return "Disponibilité";
        default:
          return "";
      }
    },
    async recomputeAllConflicts(): Promise<void> {
      await this.$accessor.conflict.computeAll();
      await this.$accessor.conflict.fetchAll();
    },
    hasPermission(permission: string): boolean {
      return this.$accessor.permission.isAllowed(
        permission,
        this.$accessor.user.me.team
      );
    },
  },
});
</script>

<style></style>
