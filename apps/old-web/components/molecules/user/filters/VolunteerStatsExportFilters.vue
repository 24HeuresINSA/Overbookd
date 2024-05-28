<template>
  <div>
    <v-card v-if="canManageUsers" class="stats-export-card">
      <v-card-title>Mode stats</v-card-title>

      <v-card-text class="stats-export-card__content">
        <v-switch
          v-model="isStatsModeActive"
          label="Afficher les stats"
          @change="propagateStatsModeActivation"
        />

        <v-btn @click="exportCSV"> exporter les bénévoles </v-btn>

        <v-btn @click="openDownloadPlanning"> télécharger les plannings </v-btn>
      </v-card-text>
    </v-card>
    <v-dialog v-model="isDownloadPlanningOpen" width="1000px">
      <DownloadLeafletsCard @close-dialog="closeDownloadPlanning" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MANAGE_USERS } from "@overbookd/permission";
import { UserPersonalData } from "@overbookd/user";
import { download } from "~/utils/file/file.utils";
import DownloadLeafletsCard from "../../planning/DownloadLeafletsCard.vue";

type VolunteerStatsExportFiltersData = {
  planningLoading: boolean;
  isStatsModeActive: boolean;
  isDownloadPlanningOpen: boolean;
};

export default defineComponent({
  name: "VolunteerStatsExportFilters",
  components: { DownloadLeafletsCard },
  props: {
    filteredVolunteers: {
      type: Array as () => UserPersonalData[],
      required: true,
    },
  },

  data: (): VolunteerStatsExportFiltersData => ({
    planningLoading: false,
    isStatsModeActive: false,
    isDownloadPlanningOpen: false,
  }),

  computed: {
    volunteers(): UserPersonalData[] {
      return this.$accessor.user.volunteers;
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
    openDownloadPlanning() {
      this.isDownloadPlanningOpen = true;
    },
    closeDownloadPlanning() {
      this.isDownloadPlanningOpen = false;
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
