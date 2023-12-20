<template>
  <div class="activity fa">
    <h1>Fiches Activités</h1>

    <main>
      <FaFilter class="activity__filtering" @change="updateFilters">
        <template #additional-actions>
          <v-btn
            v-if="canExportSignages"
            class="signa-export"
            @click="exportCsvSigna"
          >
            Export signa
          </v-btn>
        </template>
      </FaFilter>

      <v-card class="activity__listing">
        <v-data-table
          :headers="headers"
          :items="filteredFas"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1 activity__table"
          @click:row="openFa"
          @auxclick:row="openFaInNewTab"
        >
          <template #item.id="{ item }">
            <v-chip-group id="status">
              <v-chip id="status" :class="item.status.toLowerCase()" small>
                {{ item.id }}
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.reviews="{ item }">
            <v-chip-group id="reviewers" column>
              <v-chip
                v-for="reviewer of reviewers"
                :key="reviewer.code"
                :class="getReviewerStatus(item, reviewer)"
                small
              >
                <v-icon small> {{ reviewer.icon }} </v-icon>
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.adherent="{ item }">
            {{ formatUsername(item.adherent) }}
          </template>

          <template #item.team="{ item }">
            <TeamChip v-if="item.team" :team="item.team" with-name />
          </template>

          <template #item.removal="{ item }">
            <v-icon v-show="canRemoveFa" @click.stop="openRemovalDialog(item)">
              mdi-delete
            </v-icon>
          </template>

          <template #no-data> Aucune FA trouvée </template>
        </v-data-table>
      </v-card>
    </main>

    <v-btn
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="openNewFaDialog"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewFaDialogOpen" max-width="600">
      <NewFaCard @close-dialog="closeNewFaDialog" />
    </v-dialog>

    <v-dialog v-model="isRemovalDialogOpen" max-width="600">
      <ConfirmationMessage
        confirm-color="error"
        @close-dialog="closeRemovalDialog"
        @confirm="removeFa"
      >
        <template #title>
          Suppression de la FA #<strong>
            {{ activityToRemove?.id }}
          </strong>
        </template>
        <template #statement>
          Tu es sur le point de supprimer la FA
          <strong>{{ activityToRemove?.name }}</strong
          >. Es-tu sûr de faire ça ?
        </template>
        <template #confirm-btn-content>
          <v-icon left> mdi-delete </v-icon>Supprimer
        </template>
      </ConfirmationMessage>
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NewFaCard from "~/components/molecules/festival-event/creation/NewFaCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import FaFilter from "~/components/organisms/festival-event/festival-activity/FaFilter.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import { formatUsername } from "~/utils/user/user.utils";
import { Team } from "~/utils/models/team.model";
import { Header } from "~/utils/models/data-table.model";
import { Searchable } from "~/utils/search/search.utils";
import { SlugifyService } from "@overbookd/slugify";
import { WRITE_FA, WRITE_SIGNAGE_CATALOG } from "@overbookd/permission";
import {
  PreviewFestivalActivity,
  FestivalActivity,
} from "@overbookd/festival-activity";
import { User } from "@overbookd/user";
import {
  Filters,
  ReviewsFilter,
  findReviewStatus,
} from "~/utils/festival-event/festival-activity.filter";
import { isDraftPreview } from "~/utils/festival-event/festival-activity.model";
import { getPreviewReviewStatus } from "~/utils/festival-event/festival-activity.utils";

interface FaData {
  headers: Header[];
  isNewFaDialogOpen: boolean;
  isRemovalDialogOpen: boolean;
  activityToRemove?: PreviewFestivalActivity;
  filters: Filters;
}

export default defineComponent({
  name: "Fa",
  components: {
    NewFaCard,
    TeamChip,
    SnackNotificationContainer,
    FaFilter,
    ConfirmationMessage,
  },
  data: (): FaData => ({
    headers: [
      { text: "Statut", value: "id" },
      { text: "Validations", value: "reviews", sortable: false },
      { text: "Nom", value: "name" },
      { text: "Equipe", value: "team" },
      { text: "Responsable", value: "adherent", sortable: false },
      { text: "Suppression", value: "removal", sortable: false },
    ],
    isNewFaDialogOpen: false,
    isRemovalDialogOpen: false,
    activityToRemove: undefined,
    filters: {},
  }),
  head: () => ({
    title: "Fiches Activités",
  }),
  computed: {
    fas(): PreviewFestivalActivity[] {
      return this.$accessor.festivalActivity.allActivities;
    },
    reviewers(): Team[] {
      return this.$accessor.team.faValidators;
    },
    searchableFas(): Searchable<PreviewFestivalActivity>[] {
      return this.fas.map((fa) => ({
        ...fa,
        searchable: SlugifyService.apply(`${fa.id} ${fa.name}`),
      }));
    },
    filteredFas(): PreviewFestivalActivity[] {
      const { team, status, search, ...reviews } = this.filters;

      return this.searchableFas.filter((fa) => {
        return (
          this.filterFaByTeam(team)(fa) &&
          this.filterFaByStatus(status)(fa) &&
          this.filterFaByNameAndId(search)(fa) &&
          this.filterFaByReviews(reviews)(fa)
        );
      });
    },
    canRemoveFa(): boolean {
      return this.$accessor.user.can(WRITE_FA);
    },
    canExportSignages(): boolean {
      return this.$accessor.user.can(WRITE_SIGNAGE_CATALOG);
    },
  },

  async mounted() {
    await Promise.all([
      this.$accessor.team.fetchFaValidators(),
      this.$accessor.festivalActivity.fetchAllActivities(),
    ]);
  },

  methods: {
    filterFaByTeam(
      teamSearched?: Team,
    ): (fa: PreviewFestivalActivity) => boolean {
      return teamSearched ? (fa) => fa.team === teamSearched.code : () => true;
    },

    filterFaByStatus(
      statusSearched?: FestivalActivity["status"],
    ): (fa: PreviewFestivalActivity) => boolean {
      return statusSearched ? (fa) => fa.status === statusSearched : () => true;
    },

    filterFaByNameAndId(
      search?: string,
    ): (fa: Searchable<PreviewFestivalActivity>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search ?? "");
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },

    filterFaByReviews(
      reviews: ReviewsFilter,
    ): (fa: Searchable<PreviewFestivalActivity>) => boolean {
      const reviewersWithStatus = Object.entries(reviews);
      return (fa) => {
        const reviewsAreEmpty = reviewersWithStatus.length === 0;
        if (reviewsAreEmpty) return true;
        if (isDraftPreview(fa)) return false;

        return reviewersWithStatus.every(
          ([reviewer, status]) =>
            getPreviewReviewStatus(fa, reviewer) === status,
        );
      };
    },

    updateFilters(filters: Filters) {
      this.filters = filters;
    },

    getReviewerStatus(
      activity: PreviewFestivalActivity,
      reviewer: Team,
    ): string {
      if (isDraftPreview(activity)) return "";
      const status = activity.reviews[reviewer.code];
      return (findReviewStatus(status) ?? "").toLowerCase();
    },

    /*async exportCsvSecu() {
      // Parse data into a CSV string to be passed to the download function
      const csvHeader = "Numero;Nom;Resp;Nombre_de_pass;";
      const csvRows = this.FAs.map((fa) => {
        const rowData = [
          fa.id,
          fa.name,
          fa.userInCharge ? formatUsername(fa.userInCharge) : "",
          fa.numberOfPass,
        ];
        return `${rowData.join(";")}`;
      });
      const csv = [csvHeader, ...csvRows].join("\n");
      const regex = new RegExp(/undefined/i, "g");
      const parsedCSV = csv.replace(regex, "");
      this.download("passsecu.csv", parsedCSV);
    },*/

    async exportCsvSigna() {
      const signaNeeds = await this.$accessor.fa.getSignaNeedsForCsv();
      if (!signaNeeds) return;
      const csvHeader =
        "Numéro FA;Nom FA;Type;Texte;Nombre;Taille;Commentaire;";
      const csvRows = signaNeeds.map((signaNeed) => {
        const rowData = [
          signaNeed.faId,
          signaNeed.faName,
          signaNeed.signaType,
          signaNeed.text,
          signaNeed.count,
          signaNeed.size,
          signaNeed.comment,
        ];
        return `${rowData.join(";")}`;
      });
      const csv = [csvHeader, ...csvRows].join("\n");
      const regex = new RegExp(/undefined/i, "g");
      const parsedCSV = csv.replace(regex, "");
      this.download("exportSigna.csv", parsedCSV);
    },

    download(filename: string, text: string) {
      // We use the 'a' HTML element to incorporate file generation into
      // the browser rather than server-side
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text),
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    formatUsername(user?: User): string {
      return user ? formatUsername(user) : "";
    },

    openFa(fa: PreviewFestivalActivity, _: unknown, event: PointerEvent) {
      if (event.ctrlKey) {
        return this.openFaInNewTab(event, { item: fa });
      }
      this.$router.push({ path: `/fa/${fa.id}` });
    },

    openFaInNewTab(_: Event, { item: fa }: { item: PreviewFestivalActivity }) {
      const activityRoute = this.$router.resolve({ path: `/fa/${fa.id}` });
      window.open(activityRoute.href, "_blank");
    },

    removeFa() {
      if (!this.activityToRemove) return;
      this.$accessor.festivalActivity.remove(this.activityToRemove.id);
    },

    openNewFaDialog() {
      this.isNewFaDialogOpen = true;
    },
    closeNewFaDialog() {
      this.isNewFaDialogOpen = false;
    },
    openRemovalDialog(fa: PreviewFestivalActivity) {
      this.activityToRemove = fa;
      this.isRemovalDialogOpen = true;
    },
    closeRemovalDialog() {
      this.isRemovalDialogOpen = false;
      this.activityToRemove = undefined;
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 15px;
}

.custom-container {
  display: flex;
  margin: 1%;
}

.sidebar {
  padding: 0;
  width: fit-content;
}

.activity {
  main {
    display: flex;
    padding: 10px 30px 10px 10px;
    gap: 15px;
    @media screen and (max-width: $mobile-max-width) {
      flex-direction: column;
      padding: 10px;
    }
  }
  &__listing {
    margin-left: 20px;
    margin-bottom: 40px;
    height: fit-content;
    width: 100vw;
    flex-grow: 3;
  }
  &__filtering {
    flex-grow: 1;
    min-width: 300px;
  }
  &__table {
    cursor: pointer;
  }
}

.signa-export {
  margin-top: 10px;
  @media screen and (max-width: $mobile-max-width) {
    display: none;
  }
}

.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
  @media screen and (max-width: $mobile-max-width) {
    bottom: 70px;
  }
}

@media only screen and (max-width: $mobile-max-width) {
  .custom-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .activity {
    &__listing {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
