<template>
  <div class="volunteers-header">
    <div class="filters">
      <v-text-field
        :model-value="filters.search"
        label="Recherche"
        density="compact"
        bg-color="surface"
        class="filters__field"
        hide-details
        clearable
        @update:model-value="updateSearchParam"
      />

      <SearchTeams
        :model-value="filters.teams ?? []"
        label="Equipe(s)"
        density="compact"
        bg-color="surface"
        class="filters__field"
        closable-chips
        hide-details
        @update:model-value="updateTeamsParam"
      />

      <SearchTeams
        v-if="canFilterByExcludedTeams"
        :model-value="filters.excludedTeams ?? []"
        label="Équipe(s) à exclure"
        density="compact"
        bg-color="surface"
        class="filters__field"
        closable-chips
        hide-details
        @update:model-value="updateExcludedTeamsParam"
      />
    </div>
    <div class="icons-action">
      <v-btn-toggle
        v-model="isTrombinoscopeDisplayed"
        color="primary"
        size="small"
        class="display-mode desktop-only"
      >
        <v-btn
          :value="true"
          icon="mdi-view-grid"
          :rounded="false"
          class="display-mode__btn"
        />
        <v-btn
          :value="false"
          icon="mdi-view-list"
          :rounded="false"
          class="display-mode__btn"
        />
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import type { Team } from "@overbookd/team";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import type { VolunteerFilters } from "~/utils/user/volunteer.filter";

const userStore = useUserStore();

const filters = defineModel<VolunteerFilters>("filters", { required: true });
const isTrombinoscopeDisplayed = defineModel<boolean>("trombinoscope", {
  required: true,
});

const updateSearchParam = (search?: string) => {
  filters.value.search = search;
  updateQueryParams("search", search);
};
const updateTeamsParam = (teams: Team[]) => {
  filters.value.teams = teams;
  const teamsCode = teams.map(({ code }) => code);
  updateQueryParams("teams", teamsCode);
};
const updateExcludedTeamsParam = (excludedTeams: Team[]) => {
  filters.value.excludedTeams = excludedTeams;
  const excludedTeamsCode = excludedTeams.map(({ code }) => code);
  updateQueryParams("excludedTeams", excludedTeamsCode);
};

const canFilterByExcludedTeams = computed<boolean>(
  () =>
    userStore.can(AFFECT_VOLUNTEER) ||
    filters.value.excludedTeams?.length !== 0,
);
</script>

<style lang="scss" scoped>
.volunteers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin: 5px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  &__field {
    width: 260px;
    @media screen and (max-width: $mobile-max-width) {
      width: 100%;
    }
  }
}

.display-mode {
  height: 40px !important;
  border: 1px solid rgba(var(--v-border-color), 0.3);
}
</style>
