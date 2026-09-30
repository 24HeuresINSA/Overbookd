<template>
  <div class="stat-form">
    <v-combobox
      v-model="team"
      :items="teams"
      label="Equipe"
      class="stat-form__input"
      hide-details
    />
    <v-text-field
      v-model="count"
      label="Nombre validées"
      class="stat-form__input"
      type="number"
      hide-details
    />
    <v-btn
      text="Ajouter une stat"
      color="primary"
      :disabled="canNotCreateStat"
      @click="createStat"
    />
  </div>
</template>

<script lang="ts" setup>
import type { FestivalEventStatConfigValue } from "@overbookd/configuration";
import type { Team } from "@overbookd/team";

const { teams } = useTeamStore();

const team = ref<Team | string>("");
const count = ref<number | undefined>();

const canNotCreateStat = computed<boolean>(
  () =>
    !(typeof team.value === "string" ? team.value.trim() : team.value) ||
    !count.value,
);

const emit = defineEmits(["create"]);
const createStat = async () => {
  if (canNotCreateStat.value) return;
  const stat: FestivalEventStatConfigValue = {
    code: typeof team.value === "string" ? team.value.trim() : team.value.code,
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
  gap: 15px;
  align-items: center;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    &__input {
      width: 100%;
    }
  }
}
</style>
