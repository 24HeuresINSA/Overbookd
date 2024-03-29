<template>
  <v-card v-if="canManageUsers" class="stats-export-card">
    <v-card-title>Mode stats</v-card-title>

    <v-card-text class="stats-export-card__content">
      <v-switch
        v-model="isStatsModeActive"
        label="Afficher les stats"
        @change="propagateStatsModeActivation"
      />

      <v-btn @click="exportCSV"> exporter les bénévoles </v-btn>

      <v-btn :loading="planningLoading" @click="exportPlannings">
        exporter les plannings
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { MANAGE_USERS } from "@overbookd/permission";
import { UserPersonalData } from "@overbookd/user";
import { VolunteerPlanning } from "~/store/planning";
import { downloadPlanning } from "~/utils/planning/download";
import { download } from "~/utils/file/file.utils";

type VolunteerStatsExportFiltersData = {
  planningLoading: boolean;
  isStatsModeActive: boolean;
};

export default Vue.extend({
  name: "VolunteerStatsExportFilters",
  props: {
    filteredVolunteers: {
      type: Array as () => UserPersonalData[],
      required: true,
    },
  },

  data: (): VolunteerStatsExportFiltersData => ({
    planningLoading: false,
    isStatsModeActive: false,
  }),

  computed: {
    volunteers(): UserPersonalData[] {
      return this.$accessor.user.volunteers;
    },
    volunteerPlannings(): VolunteerPlanning[] {
      return this.$accessor.planning.volunteerPlannings;
    },
    canManageUsers(): boolean {
      return this.$accessor.user.can(MANAGE_USERS);
    },
  },

  methods: {
    propagateStatsModeActivation() {
      this.$emit("change:statsMode", this.isStatsModeActive);
    },

    async exportCSV() {
      // Parse data into a CSV string to be passed to the download function
      const lineReturnRegex = new RegExp("(\\r\\n|\\n|\\r)", "gm");
      const csvHeader =
        "Prenom;Nom;Surnom;Charisme;Equipes;Email;Date de naissance;Telephone;Commentaire";

      const csvContent = this.volunteers.map((volunteer: UserPersonalData) => {
        return [
          volunteer.firstname,
          volunteer.lastname,
          volunteer.nickname,
          volunteer.charisma,
          volunteer.teams?.join(", ") ?? "",
          volunteer.email,
          volunteer.birthdate,
          volunteer.phone,
          volunteer.comment?.replace(lineReturnRegex, " ") ?? "",
        ].join(";");
      });

      const csv = [csvHeader, ...csvContent].join("\n");
      const regex = new RegExp(/undefined/i, "g");

      const parsedCSV = csv.replace(regex, "");
      download("utilisateurs.csv", parsedCSV);
    },

    async exportPlannings() {
      this.planningLoading = true;
      await this.$accessor.planning.fetchAllPdfPlannings(
        this.filteredVolunteers.filter(({ charisma }) => charisma > 0),
      );
      this.volunteerPlannings.map(({ volunteer, planningBase64Data }) =>
        downloadPlanning(planningBase64Data, volunteer),
      );
      this.planningLoading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.stats-export-card {
  width: 100%;
  @media screen and (max-width: $mobile-max-width) {
    display: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1em;
    text-align: start;
  }
}
</style>
