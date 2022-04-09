<template>
  <div>
    <v-btn v-if="hasRole('humain')" @click="recomputeAllConflicts">
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
            v-for="conflit in conflictsbyUser"
            :key="conflit.id"
            v-html="computeConflictRow(conflit)"
          ></tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Conflict} from "~/utils/models/conflicts";
import sanitizeHtml from "sanitize-html";

declare type ConflictFT = Conflict & {
  ft1: number;
  ft2: number;
};

export default Vue.extend({
  computed: {
    conflictsbyUser(): Conflict[] {
      return this.$accessor.conflict.sortedByUser();
    },
    nbConflits(): number {
      return this.$accessor.conflict.conflicts.length;
    },
  },
  async mounted() {
    if (this.$accessor.user.hasRole("hard")) {
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
    computeConflictRow(conflit: ConflictFT): string {
      return `
        <td>${
          sanitizeHtml(conflit.user.firstname) +
          " " +
          sanitizeHtml(conflit.user.lastname)
        }</td>
        <td>${this.conflictTypeText(conflit.type)}</td>
        <td>
          <a href="/ft/${conflit.ft1}">${conflit.ft1}</a>
        </td>
        <td>
          <a href="/ft/${conflit.ft2}">${conflit.ft2}</a>
        </td>
      `;
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
    hasRole(role: string): boolean {
      return this.$accessor.user.hasRole(role);
    },
  },
});
</script>

<style></style>
