<template>
  <FestivalEventFilter
    v-model:search="filters.search"
    v-model:team="filters.team"
    v-model:adherent="filters.adherent"
    v-model:status="filters.status"
    identifier="FT"
  >
    <template #additional-filters>
      <SearchUser
        v-if="isHumainMember"
        v-model="filters.reviewer"
        :list="assignableReviewers"
        label="Relecteur"
        clearable
        @update:model-value="updateReviewerParam"
      />
      <div
        v-for="reviewer of reviewerTeams"
        :key="reviewer.code"
        class="desktop"
      >
        <v-btn-toggle
          v-model="filters[reviewer.code]"
          color="primary"
          class="review-filter"
          group
          @update:model-value="updateReviewParams(reviewer.code, $event)"
        >
          <v-icon size="small" class="review-filter__icon">
            {{ reviewer.icon }}
          </v-icon>
          <v-btn
            v-for="[status, label] of reviewStatusLabels"
            :key="status"
            :value="status"
            :text="label"
            class="review-filter__btn"
            size="x-small"
          />
        </v-btn-toggle>
      </div>
    </template>
  </FestivalEventFilter>
</template>

<script lang="ts" setup>
import {
  type ReviewStatus,
  type Reviewer,
  elec,
  humain,
  matos,
} from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import type { User } from "@overbookd/user";
import type { TaskFilters } from "~/utils/festival-event/festival-task/festival-task.filter";
import { reviewStatusLabel } from "~/utils/festival-event/festival-event.utils";
import { updateQueryParams } from "~/utils/http/url-params.utils";

const teamStore = useTeamStore();
const userStore = useUserStore();

const filters = defineModel<TaskFilters>({ required: true });

const reviewers: Reviewer<"FT">[] = [humain, matos, elec];
type ReviewerTeam = Team & { code: Reviewer<"FT"> };
const reviewerTeams = computed<ReviewerTeam[]>(() => {
  return reviewers
    .map((reviewer) => teamStore.getTeamByCode(reviewer))
    .filter((team): team is ReviewerTeam => team !== undefined);
});
const reviewStatusLabels = [...reviewStatusLabel.entries()];

const isHumainMember = computed(() => userStore.isMemberOf(humain));
const assignableReviewers = computed<User[]>(() =>
  userStore.users.filter(({ teams }) => teams.includes(humain)),
);

const updateReviewParams = (
  reviewer: Reviewer<"FT">,
  review?: ReviewStatus,
) => {
  updateQueryParams(reviewer, review);
};

const updateReviewerParam = (reviewer?: User) => {
  updateQueryParams("reviewer", reviewer?.id);
};
</script>

<style lang="scss" scoped>
.desktop {
  @media screen and (max-width: $mobile-max-width) {
    display: none;
  }
}

.review-filter {
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
