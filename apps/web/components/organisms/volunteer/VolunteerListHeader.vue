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
        label="Équipe(s)"
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

    <div class="icons-action desktop-only">
      <v-btn
        v-if="canManageUsers"
        icon="mdi-export"
        aria-label="Exporter les bénévoles"
        title="Exporter les bénévoles"
        variant="flat"
        size="large"
        density="comfortable"
        class="icons-action__button"
        @click="exportCSV"
      />
      <v-btn
        v-if="canAffectVolunteer"
        icon="mdi-download"
        aria-label="Télécharger les plannings"
        title="Télécharger les plannings"
        variant="flat"
        size="large"
        density="comfortable"
        class="icons-action__button"
        @click="downloadLeaflets"
      />
      <v-btn-toggle
        v-model="displayMode"
        color="primary"
        size="small"
        class="icons-action__button"
        mandatory
        @update:model-value="updateDisplayModeParam"
      >
        <v-btn
          :value="TROMBINOSCOPE"
          icon="mdi-view-grid"
          aria-label="Affichage trombinoscope"
          title="Affichage trombinoscope"
          :rounded="false"
        />
        <v-btn
          :value="VOLUNTEER_LIST"
          icon="mdi-view-list"
          aria-label="Affichage liste"
          title="Affichage liste"
          :rounded="false"
        />
        <v-btn
          v-if="canAffectVolunteer"
          :value="VOLUNTEER_STATS"
          icon="mdi-chart-bar"
          aria-label="Affichage statistiques"
          title="Affichage statistiques"
          :rounded="false"
        />
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AFFECT_VOLUNTEER, MANAGE_USERS } from "@overbookd/permission";
import type { Team } from "@overbookd/team";
import { useDebounceFn } from "@vueuse/core";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import {
  DisplayModeBuilder,
  TROMBINOSCOPE,
  VOLUNTEER_LIST,
  VOLUNTEER_STATS,
  type DisplayMode,
} from "~/utils/user/volunteer.display";
import type { VolunteerFilters } from "~/utils/user/volunteer.filter";

const userStore = useUserStore();

const filters = defineModel<VolunteerFilters>("filters", { required: true });
const displayMode = defineModel<DisplayMode>("displayMode", {
  required: true,
});

const updateSearchParam = useDebounceFn((search?: string) => {
  filters.value.search = search;
  updateQueryParams("search", search);
}, 200);
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

const updateDisplayModeParam = (mode: DisplayMode) => {
  DisplayModeBuilder.saveToStorage(mode);
  updateQueryParams("displayMode", mode);
};

const canManageUsers = computed<boolean>(() => userStore.can(MANAGE_USERS));
const canAffectVolunteer = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);

const canFilterByExcludedTeams = computed<boolean>(
  () => canAffectVolunteer.value || filters.value.excludedTeams?.length !== 0,
);

const emit = defineEmits(["export-csv", "download-leaflets"]);
const exportCSV = () => {
  if (!canManageUsers.value) return;
  emit("export-csv");
};
const downloadLeaflets = () => {
  if (!canAffectVolunteer.value) return;
  emit("download-leaflets");
};
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

.icons-action {
  display: flex;
  align-items: center;
  gap: 10px;
  &__button {
    height: 42px !important;
    border: 1px solid rgba(var(--v-border-color), 0.3);
  }
}
</style>
