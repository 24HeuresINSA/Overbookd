<template>
  <v-card class="download-leaflets-card">
    <v-btn class="download-leaflets-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="download-leaflets-card__title">
      <h2>Télécharger les livrets</h2>
    </v-card-title>
    <v-card-text class="download-leaflets-card__details">
      <v-alert
        v-show="isMaximumVolunteerLimitReached"
        id="max-volunteers"
        icon="mdi-alert-circle"
        border="left"
        prominent
        dismissible
      >
        <h2 class="summary">Plus de {{ maxVolunteers }} bénévoles</h2>
        <p class="catch-phrase">Ça fait beaucoup la non ?!</p>
        <p class="details">
          Le téléchargement risque de prendre beaucoup de temps et sera fait en
          plusieurs fois.
        </p>
      </v-alert>
      <fieldset>
        <legend>Filtres</legend>
        <span>Équipes:</span>
        <SearchTeams v-model="teams" hide-details />
        <span>Bénévole:</span>
        <v-text-field
          v-model="search"
          label="Recherche"
          hide-details
          solo
          filled
        />
      </fieldset>
      <details>
        <summary>
          {{ displayedVolunteers.length }} bénévoles correspondant
        </summary>
        <v-data-table
          :items="displayedVolunteers"
          :headers="headers"
          :custom-sort="sortVolunteers"
        >
          <template #item.volunteer="{ item }">
            {{ formatUserNameWithNickname(item) }}
          </template>

          <template #item.teams="{ item }">
            <div class="team-list">
              <TeamChip
                v-for="team of item.teams"
                :key="team"
                :team="team"
                with-name
              />
            </div>
          </template>
        </v-data-table>
      </details>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        :loading="downloadInProgress"
        x-large
        @click="downloadAllPlannings"
      >
        <v-icon left>mdi-download</v-icon>
        Télécharger {{ displayedVolunteers.length }} plannings
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { VolunteerForPlanning, HasAssignment } from "~/store/planning";
import { sortVolunteerOnNames, SortFunction } from "~/utils/sort/sort-stats";
import { Header } from "~/utils/data-table/header";
import { Team } from "@overbookd/http";
import { keepMembersOf } from "~/utils/search/search-team";
import { toSearchable } from "~/utils/search/search-user";
import {
  keepMatchingSearchCriteria,
  Searchable,
} from "~/utils/search/search.utils";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

const MAX_PLANNING_DOWNLOAD_IN_PARALLEL = 50;

type DownloadLeafletsCardData = {
  headers: Header[];
  teams: Team[];
  search: string;
  downloadInProgress: boolean;
};

function sortVolunteerOnAssignment(desc: boolean): SortFunction<HasAssignment> {
  return (a, b) => {
    const order = desc ? -1 : 1;
    return (a.assignment.inMilliseconds - b.assignment.inMilliseconds) * order;
  };
}

export default defineComponent({
  name: "DownloadLeafletsCard",
  components: { SearchTeams, TeamChip },
  emits: ["close-dialog"],
  data: (): DownloadLeafletsCardData => ({
    headers: [
      { text: "Prénom Nom (Surnom)", value: "volunteer" },
      { text: "Équipes", value: "teams", sortable: false },
      { text: "Affectaction", value: "assignment", width: "120px" },
    ],
    teams: [],
    search: "",
    downloadInProgress: false,
  }),
  computed: {
    volunteers(): Searchable<VolunteerForPlanning>[] {
      return this.$accessor.planning.volunteers.map(toSearchable);
    },
    maxVolunteers(): number {
      return MAX_PLANNING_DOWNLOAD_IN_PARALLEL;
    },
    displayedVolunteers(): VolunteerForPlanning[] {
      const isPartOfTeams = keepMembersOf(this.teams);
      const hasSimilarName = keepMatchingSearchCriteria(this.search);
      return this.volunteers.filter((volunteer) => {
        return isPartOfTeams(volunteer) && hasSimilarName(volunteer);
      });
    },
    isMaximumVolunteerLimitReached(): boolean {
      return (
        this.displayedVolunteers.length > MAX_PLANNING_DOWNLOAD_IN_PARALLEL
      );
    },
  },
  mounted() {
    this.$accessor.planning.fetchVolunteers();
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    sortVolunteers(
      volunteers: VolunteerForPlanning[],
      sortsBy: string[],
      sortsDesc: boolean[],
    ): VolunteerForPlanning[] {
      const sortsOn = sortsBy.at(0);
      const desc = sortsDesc.at(0);
      if (sortsOn === undefined || desc === undefined) return volunteers;

      const sortFunction =
        sortsOn === "volunteer"
          ? sortVolunteerOnNames(desc)
          : sortVolunteerOnAssignment(desc);

      return this.volunteers.sort(sortFunction);
    },
    async downloadAllPlannings() {
      this.downloadInProgress = true;
      await this.$accessor.planning.downloadAllPdfPlannings(
        this.displayedVolunteers,
      );
      this.downloadInProgress = false;
    },
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped>
.download-leaflets-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__subtitle {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 10px;
  }
  &__details {
    h3 {
      margin-bottom: 3px;
      margin-top: 3px;
    }
    p {
      margin-bottom: 0px;
    }
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
  strong {
    font-weight: 900;
  }
}

details {
  border: 1px solid #aaa;
  border-radius: 4px;
  padding: 0.5em 0.5em 0;
  min-width: 100%;
  & summary {
    font-size: 1.2rem;
    font-weight: bold;
    margin: -0.5em -0.5em 0;
    padding: 0.5em;
  }

  &[open] {
    padding: 0.5em;
    & summary {
      border-bottom: 1px solid #aaa;
      margin-bottom: 0.5em;
    }
  }
}

fieldset {
  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 10px 20px;
  font-size: 1.2rem;
  padding: 10px;
  align-items: baseline;
  legend {
    font-weight: bold;
    font-size: 1.3rem;
    padding: 5px;
  }
}

#max-volunteers {
  background-color: $yellow-24h;
  border-color: $yellow-24h;
  .details {
    padding-right: 30px;
  }
}

.team-list {
  display: flex;
  gap: 5px 10px;
  flex-wrap: wrap;
  padding: 5px 0px;
}
</style>
~/utils/sort/sort-stats
