<template>
  <FestivalEventFilter
    :search="filters.search"
    :team="filters.team"
    :adherent="filters.adherent"
    :status="filters.status"
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
  FestivalActivity,
  ReviewStatus,
  Reviewer,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "@overbookd/festival-event";
import { User } from "@overbookd/user";
import { defineComponent } from "vue";
import FestivalEventFilter from "~/components/molecules/festival-event/filter/FestivalEventFilter.vue";
import {
  ActivityFilterBuilder,
  findReviewStatus,
  findStatus,
  ActivityFilters,
} from "~/utils/festival-event/festival-activity/festival-activity.filter";
import {
  ReviewLabel,
  reviewStatusLabel,
} from "~/utils/festival-event/festival-event.utils";
import { nonEmptyString } from "~/utils/festival-event/festival-event.filter";
import { Team } from "~/utils/models/team.model";

type ReviewerTeam = Team & {
  code: Reviewer<"FA">;
};

export default defineComponent({
  name: "FaFilter",
  components: {
    FestivalEventFilter,
  },
  model: {
    prop: "gear",
    event: "change",
  },
  emits: ["change"],
  computed: {
    filters(): ActivityFilters {
      const builder = ActivityFilterBuilder.init({
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
      const barrieresReview = builder.extractQueryParamsValue(
        this.$route.query,
        barrieres,
      );
      const signaReview = builder.extractQueryParamsValue(
        this.$route.query,
        signa,
      );
      const communicationReview = builder.extractQueryParamsValue(
        this.$route.query,
        communication,
      );
      const secuReview = builder.extractQueryParamsValue(
        this.$route.query,
        secu,
      );

      return {
        ...search,
        ...team,
        ...adherent,
        ...status,
        ...humainReview,
        ...matosReview,
        ...elecReview,
        ...barrieresReview,
        ...signaReview,
        ...communicationReview,
        ...secuReview,
      };
    },
    reviewers(): Reviewer<"FA">[] {
      return [humain, matos, secu, barrieres, signa, elec, communication];
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
      this.$emit("change", this.filters);
    },
  },
  mounted() {
    this.$emit("change", this.filters);
  },
  methods: {
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

    findAdherentById(adherentId: User["id"]): User | undefined {
      return this.$accessor.user.adherents.find(({ id }) => id === adherentId);
    },

    updateStatus(status?: FestivalActivity["status"]) {
      this.updateQueryParams("status", status);
    },

    updateReviewer(reviewer: Reviewer<"FA">, review: ReviewStatus) {
      this.updateQueryParams(reviewer, review);
    },

    updateQueryParams(key: keyof ActivityFilters, value?: string) {
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

<style lang="scss" scoped>
.desktop {
  @media screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
