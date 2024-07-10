<template>
  <FestivalEventFilter
    v-model:search="filters.search"
    v-model:team="filters.team"
    v-model:adherent="filters.adherent"
    v-model:status="filters.status"
  >
    <template #additional-filters>
      <div
        v-for="reviewer of reviewerTeams"
        :key="reviewer.code"
        class="desktop"
      >
        <v-btn-toggle
          v-model="filters[reviewer.code]"
          color="primary"
          class="reviewer-filter"
          group
          @update:model-value="updateReviewerParams(reviewer.code, $event)"
        >
          <v-icon size="small" class="reviewer-filter__icon">
            {{ reviewer.icon }}
          </v-icon>
          <v-btn
            v-for="[status, label] of reviewStatusLabels"
            :key="status"
            :value="status"
            :text="label"
            class="reviewer-filter__btn"
            size="x-small"
          />
        </v-btn-toggle>
      </div>

      <slot name="additional-actions" />
    </template>
  </FestivalEventFilter>
</template>

<script lang="ts" setup>
import {
  type ReviewStatus,
  type Reviewer,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "@overbookd/festival-event";
import { type ActivityFilters } from "~/utils/festival-event/festival-activity/festival-activity.filter";
import { reviewStatusLabel } from "~/utils/festival-event/festival-event.utils";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import type { Team } from "@overbookd/http";

const teamStore = useTeamStore();

const filters = defineModel<ActivityFilters>({ required: true });

const reviewers = computed<Reviewer<"FA">[]>(() => {
  return [humain, matos, secu, barrieres, signa, elec, communication];
});
type ReviewerTeam = Team & { code: Reviewer<"FA"> };
const reviewerTeams = computed<ReviewerTeam[]>(() => {
  return reviewers.value
    .map((reviewer) => teamStore.getTeamByCode(reviewer))
    .filter((team): team is ReviewerTeam => team !== undefined);
});
const reviewStatusLabels = [...reviewStatusLabel.entries()];

const updateReviewerParams = (
  reviewer: Reviewer<"FA">,
  review?: ReviewStatus,
) => {
  updateQueryParams(reviewer, review);
};
</script>

<style lang="scss" scoped>
.desktop {
  @media screen and (max-width: $mobile-max-width) {
    display: none;
  }
}

.reviewer-filter {
  align-items: center;
  gap: 5px;
  height: fit-content;

  &__icon {
    margin-top: 5px;
  }
  &__btn {
    padding: 8px;
  }
}
</style>
