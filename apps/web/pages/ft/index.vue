<template>
  <div class="task ft">
    <h1>Fiches Tâches</h1>

    <main>
      <FtFilter class="task__filtering" @update:filters="updateFilters" />
      <v-card class="task__listing">
        <v-data-table
          :headers="headers"
          :items="filteredFts"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1 task__table"
          @click:row="openFt"
          @auxclick:row="openFtInNewTab"
        >
          <template #item.id="{ item }">
            <v-chip-group id="status">
              <v-chip :class="item.status.toLowerCase()" small>
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

          <template #item.team="{ item }">
            <TeamChip v-if="item.team" :team="item.team" with-name />
          </template>

          <template #item.administrator="{ item }">
            {{ formatUsername(item.administrator) }}
          </template>

          <template #item.removal="{ item }">
            <v-icon v-show="canRemoveFt" @click.stop="openRemovalDialog(item)">
              mdi-delete
            </v-icon>
          </template>

          <template #no-data> Aucune FT trouvée </template>
        </v-data-table>
      </v-card>
    </main>

    <v-btn
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="openNewFtDialog"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewFtDialogOpen" width="600">
      <NewFtCard @close-dialog="closeNewFtDialog" />
    </v-dialog>

    <v-dialog v-model="isRemovalDialogOpen" max-width="600">
      <ConfirmationMessage
        confirm-color="error"
        @close-dialog="closeRemovalDialog"
        @confirm="removeFt"
      >
        <template #title>
          Suppression de la FT #<strong>
            {{ taskToRemove?.id }}
          </strong>
        </template>
        <template #statement>
          Tu es sur le point de supprimer la FT
          <strong>{{ taskToRemove?.name }}</strong
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
import Vue from "vue";
import NewFtCard from "~/components/molecules/festival-event/creation/NewFtCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { SlugifyService } from "@overbookd/slugify";
import { Header } from "~/utils/models/data-table.model";
import { Team } from "~/utils/models/team.model";
import { MyUserInformation, User } from "@overbookd/user";
import { formatUsername } from "~/utils/user/user.utils";
import { Searchable } from "~/utils/search/search.utils";
import { WRITE_FT } from "@overbookd/permission";
import { FestivalTask, PreviewFestivalTask } from "@overbookd/festival-event";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import FtFilter from "~/components/organisms/festival-event/festival-task/FtFilter.vue";
import {
  TaskFilters,
  TaskReviewsFilter,
  findReviewStatus,
} from "~/utils/festival-event/festival-task/festival-task.filter";
import { isDraftPreview } from "~/utils/festival-event/festival-task/festival-task.model";
import { getPreviewReviewStatus } from "~/utils/festival-event/festival-task/festival-task.utils";

interface Data {
  headers: Header[];
  isNewFtDialogOpen: boolean;
  isRemovalDialogOpen: boolean;
  taskToRemove?: PreviewFestivalTask;

  filters: TaskFilters;
}

export default Vue.extend({
  name: "Ft",
  components: {
    SnackNotificationContainer,
    NewFtCard,
    ConfirmationMessage,
    TeamChip,
    FtFilter,
  },
  data(): Data {
    return {
      headers: [
        { text: "Statut", value: "id" },
        { text: "Validations", value: "reviews", sortable: false },
        { text: "Nom", value: "name" },
        { text: "Equipe", value: "team" },
        { text: "Gestionnaire", value: "administrator", sortable: false },
        { text: "Suppression", value: "removal", sortable: false },
      ],
      filters: {},
      isNewFtDialogOpen: false,
      isRemovalDialogOpen: false,
      taskToRemove: undefined,
    };
  },

  head: () => ({
    title: "Fiches Tâches",
  }),

  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    tasks(): PreviewFestivalTask[] {
      return this.$accessor.festivalTask.tasks.forAll;
    },
    searchableFts(): Searchable<PreviewFestivalTask>[] {
      return this.tasks.map((ft) => ({
        ...ft,
        searchable: SlugifyService.apply(`${ft.id} ${ft.name}`),
      }));
    },
    filteredFts(): PreviewFestivalTask[] {
      const { search, team, status, adherent, ...reviews } = this.filters;

      return this.searchableFts.filter((ft) => {
        return (
          this.filterFtByTeam(team)(ft) &&
          this.filterFtByAdministrator(adherent)(ft) &&
          this.filterFtByStatus(status)(ft) &&
          this.filterFtByNameAndId(search)(ft) &&
          this.filterFtByReviews(reviews)(ft)
        );
      });
    },
    canRemoveFt(): boolean {
      return this.$accessor.user.can(WRITE_FT);
    },
    reviewers(): Team[] {
      return this.$accessor.team.ftValidators;
    },
  },

  async mounted() {
    await Promise.all([
      this.$accessor.team.fetchFtValidators(),
      this.$accessor.festivalTask.fetchAllTasks(),
      this.$accessor.user.fetchAdherents(),
    ]);
  },

  methods: {
    filterFtByTeam(teamSearched?: Team): (ft: PreviewFestivalTask) => boolean {
      return teamSearched ? (ft) => ft.team === teamSearched.code : () => true;
    },

    filterFtByAdministrator(
      adherent?: User,
    ): (ft: PreviewFestivalTask) => boolean {
      return adherent
        ? (ft) => ft.administrator.id === adherent.id
        : () => true;
    },

    filterFtByStatus(
      statusSearched?: FestivalTask["status"],
    ): (ft: PreviewFestivalTask) => boolean {
      return statusSearched ? (ft) => ft.status === statusSearched : () => true;
    },

    filterFtByNameAndId(
      search?: string,
    ): (ft: Searchable<PreviewFestivalTask>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search ?? "");
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },

    filterFtByReviews(
      reviews: TaskReviewsFilter,
    ): (fa: Searchable<PreviewFestivalTask>) => boolean {
      const reviewersWithStatus = Object.entries(reviews);
      return (ft) => {
        const reviewsAreEmpty = reviewersWithStatus.length === 0;
        if (reviewsAreEmpty) return true;
        if (isDraftPreview(ft)) return false;

        return reviewersWithStatus.every(
          ([reviewer, status]) =>
            getPreviewReviewStatus(ft, reviewer) === status,
        );
      };
    },

    updateFilters(filters: TaskFilters) {
      this.filters = filters;
    },

    getReviewerStatus(task: PreviewFestivalTask, reviewer: Team): string {
      if (isDraftPreview(task)) return "";
      const status = task.reviews[reviewer.code];
      return (findReviewStatus(status) ?? "").toLowerCase();
    },

    formatUsername(user?: User): string {
      return user ? formatUsername(user) : "";
    },

    removeFt() {
      if (!this.taskToRemove) return;
      this.$accessor.festivalTask.remove(this.taskToRemove.id);
    },

    openFt(ft: PreviewFestivalTask, _: unknown, event: PointerEvent) {
      if (event.ctrlKey) {
        return this.openFtInNewTab(event, { item: ft });
      }
      this.$router.push({ path: `/ft/${ft.id}` });
    },

    openFtInNewTab(_: Event, { item: ft }: { item: PreviewFestivalTask }) {
      const taskRoute = this.$router.resolve({ path: `/ft/${ft.id}` });
      window.open(taskRoute.href, "_blank");
    },

    openNewFtDialog() {
      this.isNewFtDialogOpen = true;
    },
    closeNewFtDialog() {
      this.isNewFtDialogOpen = false;
    },
    openRemovalDialog(ft: PreviewFestivalTask) {
      this.taskToRemove = ft;
      this.isRemovalDialogOpen = true;
    },
    closeRemovalDialog() {
      this.isRemovalDialogOpen = false;
      this.taskToRemove = undefined;
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 15px;
}

.task {
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
  #status {
    font-weight: bold;
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
  .task {
    &__listing {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
