<template>
  <div class="volunteers-header">
    <div class="filters">
      <v-text-field
        v-model="search"
        label="Recherche"
        density="compact"
        bg-color="surface"
        class="filters__field"
        hide-details
      />

      <SearchTeams
        v-model="teams"
        label="Equipe(s)"
        density="compact"
        bg-color="surface"
        class="filters__field"
        closable-chips
        hide-details
      />

      <SearchTeams
        v-if="canFilterByExcludedTeams"
        v-model="excludedTeams"
        label="Équipe(s) à exclure"
        density="compact"
        bg-color="surface"
        class="filters__field"
        closable-chips
        hide-details
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import type { Team } from "@overbookd/team";

const userStore = useUserStore();

const search = defineModel<string>("search", { required: true });
const teams = defineModel<Team[]>("teams", { required: true });
const excludedTeams = defineModel<Team[]>("excludedTeams", { required: true });

const canFilterByExcludedTeams = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
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
</style>
