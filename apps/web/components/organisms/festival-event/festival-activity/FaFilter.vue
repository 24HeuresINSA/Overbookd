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
        class="desktop-only"
      >
        <v-btn-toggle
          v-model="filters[reviewer.code]"
          color="primary"
          class="review-filter"
          group
          @update:model-value="updateReviewerParams(reviewer.code, $event)"
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

      <v-btn
        v-if="canViewSecurityDashboard"
        prepend-icon="mdi-security"
        color="primary"
        text="Récapitulatif Sécurité"
        class="desktop-only security"
        @click="openSecurityDashboard"
      />
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
import type { ActivityFilters } from "~/utils/festival-event/festival-activity/festival-activity.filter";
import { reviewStatusLabel } from "~/utils/festival-event/festival-event.utils";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import type { Team } from "@overbookd/team";
import { SECURITY_DASHBOARD_URL } from "@overbookd/web-page";
import { VIEW_SECURITY_DASHBOARD } from "@overbookd/permission";

const teamStore = useTeamStore();
const userStore = useUserStore();

const filters = defineModel<ActivityFilters>({ required: true });

const reviewers: Reviewer<"FA">[] = [
  humain,
  matos,
  secu,
  barrieres,
  signa,
  elec,
  communication,
];
type ReviewerTeam = Team & { code: Reviewer<"FA"> };
const reviewerTeams = computed<ReviewerTeam[]>(() => {
  return reviewers
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

const canViewSecurityDashboard = computed<boolean>(() => {
  return userStore.can(VIEW_SECURITY_DASHBOARD);
});
const openSecurityDashboard = () => {
  navigateTo(SECURITY_DASHBOARD_URL);
};
</script>

<style lang="scss" scoped>
.review-filter {
  align-items: center;
  gap: 5px;
  height: fit-content !important;

  &__icon {
    margin-top: 5px;
    margin-right: 5px;
  }
  &__btn {
    padding: 8px;
  }
}
.security {
  margin-top: 10px;
  width: 100%;
}
</style>
