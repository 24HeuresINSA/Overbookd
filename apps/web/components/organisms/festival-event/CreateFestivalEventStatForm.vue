<template>
  <div class="stat-form">
    <v-combobox
      v-model="team"
      :items="teams"
      label="Equipe"
      class="stat-form__team"
      density="compact"
      item-title="name"
      hide-details
    />
    <v-text-field
      v-model="count"
      :label="`${festivalEvent} validées`"
      class="stat-form__count"
      type="number"
      density="compact"
      hide-details
    />
    <v-btn
      text="Ajouter la stat"
      color="primary"
      class="stat-form__btn"
      :disabled="canNotCreateStat"
      @click="createStat"
    />
  </div>
</template>

<script lang="ts" setup>
import type { FestivalEventStatConfigValue } from "@overbookd/configuration";
import type { FestivalEventIdentifier } from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";

const { teams } = useTeamStore();

const { festivalEvent } = defineProps({
  festivalEvent: {
    type: String as PropType<FestivalEventIdentifier>,
    default: "FA",
  },
});

const team = ref<Team | string | undefined>();
const count = ref<number | undefined>();

const canNotCreateStat = computed<boolean>(
  () =>
    !(typeof team.value === "string" ? team.value.trim() : team.value) ||
    !count.value,
);

const emit = defineEmits(["create"]);
const createStat = async () => {
  if (canNotCreateStat.value) return;
  const code =
    typeof team.value === "string"
      ? team.value.trim()
      : (team.value?.code ?? "");
  const stat: FestivalEventStatConfigValue = {
    code,
    count: count.value ?? 0,
  };
  emit("create", stat);
  team.value = "";
  count.value = undefined;
};
</script>

<style lang="scss" scoped>
.stat-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin: 15px 0;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
  &__team {
    min-width: 100px;
    flex: 1 1 0;
    @media screen and (max-width: $mobile-max-width) {
      flex: none;
      width: 100%;
    }
  }
  &__count {
    min-width: 100px;
    flex: 0 0 120px;
    @media screen and (max-width: $mobile-max-width) {
      flex-basis: auto;
      width: 100%;
    }
  }
  &__btn {
    flex: 0 0 auto;
    @media screen and (max-width: $mobile-max-width) {
      width: 100%;
    }
  }
}
</style>
