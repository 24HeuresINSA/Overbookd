<template>
  <FestivalEventFilter
    festival-event="FT"
    :search="filters.search"
    :team="filters.team"
    :adherent="filters.adherent"
    :status="filters.status"
    adherent-label="Gestionnaire"
    @change:search="updateSearch"
    @change:team="updateTeam"
    @change:adherent="updateAdherent"
    @change:status="updateStatus"
  >
    <template #additional-filters>
      <div
        v-for="reviewer of reviewerTeams"
        :key="reviewer.code"
        class="desktop"
      >
        <v-btn-toggle
          tile
          color="deep-purple accent-3"
          group
          :value="filters[reviewer.code]"
          @change="updateReviewer(reviewer.code, $event)"
        >
          <v-icon small>{{ reviewer.icon }}</v-icon>
          <v-btn
            v-for="[status, label] of reviewStatusLabel"
            :key="status"
            :value="status"
            x-small
          >
            {{ label }}
          </v-btn>
        </v-btn-toggle>
      </div>

      <slot name="additional-actions" />
    </template>
  </FestivalEventFilter>
</template>

<script lang="ts">
import {
  FestivalTask,
  ReviewStatus,
  Reviewer,
  humain,
  matos,
  elec,
} from "@overbookd/festival-event";
import { User } from "@overbookd/user";
import { defineComponent } from "vue";
import FestivalEventFilter from "~/components/molecules/festival-event/filter/FestivalEventFilter.vue";
import { nonEmptyString } from "~/utils/festival-event/festival-event.filter";
import {
  TaskFilterBuilder,
  findReviewStatus,
  TaskFilters,
  findStatus,
} from "~/utils/festival-event/festival-task/festival-task.filter";
import {
  ReviewLabel,
  reviewStatusLabel,
} from "~/utils/festival-event/festival-event.utils";
import { Team } from "~/utils/models/team.model";

type ReviewerTeam = Team & {
  code: Reviewer<"FT">;
};

export default defineComponent({
  name: "FtFilter",
  components: { FestivalEventFilter },
  emits: ["update:filters"],
  computed: {
    filters(): TaskFilters {
      const builder = TaskFilterBuilder.init({
        isNotEmpty: nonEmptyString,
        isExistingReview: findReviewStatus,
        isExistingStatus: findStatus,
        isExistingAdherent: this.findAdherentById,
        isExistingTeam: this.$accessor.team.getTeamByCode,
      });
      const search = builder.extractQueryParamsValue(
        this.$route.query,
        "search",
      );
      const team = builder.extractQueryParamsValue(this.$route.query, "team");
      const adherent = builder.extractQueryParamsValue(
        this.$route.query,
        "adherent",
      );
      const status = builder.extractQueryParamsValue(
        this.$route.query,
        "status",
      );
      const humainReview = builder.extractQueryParamsValue(
        this.$route.query,
        humain,
      );
      const matosReview = builder.extractQueryParamsValue(
        this.$route.query,
        matos,
      );
      const elecReview = builder.extractQueryParamsValue(
        this.$route.query,
        elec,
      );

      return {
        ...search,
        ...team,
        ...adherent,
        ...status,
        ...humainReview,
        ...matosReview,
        ...elecReview,
      };
    },
    reviewers(): Reviewer<"FT">[] {
      return [humain, matos, elec];
    },
    reviewerTeams(): ReviewerTeam[] {
      return this.reviewers
        .map((reviewer) => this.$accessor.team.getTeamByCode(reviewer))
        .filter((team): team is ReviewerTeam => team !== undefined);
    },
    reviewStatusLabel(): [ReviewStatus, ReviewLabel][] {
      return [...reviewStatusLabel.entries()];
    },
  },
  watch: {
    filters() {
      this.$emit("update:filters", this.filters);
    },
  },
  methods: {
    findAdherentById(adherentId: User["id"]): User | undefined {
      return this.$accessor.user.adherents.find(({ id }) => id === adherentId);
    },
    updateSearch(search?: string) {
      this.updateQueryParams("search", search);
    },

    updateTeam(team?: Team) {
      this.updateQueryParams("team", team?.code);
    },

    updateAdherent(adherent?: User) {
      const id = adherent?.id ? `${adherent.id}` : undefined;
      this.updateQueryParams("adherent", id);
    },

    updateStatus(status?: FestivalTask["status"]) {
      this.updateQueryParams("status", status);
    },

    updateReviewer(reviewer: Reviewer<"FT">, review: ReviewStatus) {
      this.updateQueryParams(reviewer, review);
    },

    updateQueryParams(key: keyof TaskFilters, value?: string) {
      const currentQuery = this.$route.query;
      const path = this.$route.path;
      if (!value) {
        const { [key]: remove, ...remainingQuery } = currentQuery;
        this.$router.push({ path, query: remainingQuery });
        return;
      }
      const query = { ...currentQuery, [key]: value };
      this.$router.push({ path, query });
    },
  },
});
</script>
