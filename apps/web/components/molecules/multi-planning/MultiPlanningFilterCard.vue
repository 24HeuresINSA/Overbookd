<template>
  <v-card>
    <v-card-title> Filtres </v-card-title>
    <v-card-text class="card-content">
      <div class="card-content__line">
        <SearchTeams
          v-model="teams"
          label="Équipe(s)"
          hide-details
          closable-chips
          class="fixed-width-field"
        />
        <SearchTeams
          v-model="excludedTeams"
          label="Équipe(s) à exclure"
          hide-details
          closable-chips
          class="fixed-width-field"
        />
        <v-btn
          :text="`Ajouter les membres de ${teams.length} ${pluralize('équipe', teams.length)}`"
          color="primary"
          :disabled="teams.length === 0"
          @click="addVolunteersFromTeams"
        />
      </div>

      <div class="card-content__line">
        <SearchUsers
          v-model="volunteers"
          label="Bénévoles"
          hide-details
          closable-chips
          clearable
        />
        <v-btn
          text="Appliquer"
          color="primary"
          :loading="loading"
          @click="selectVolunteers"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import type { User } from "@overbookd/user";

const userStore = useUserStore();

const volunteers = defineModel<User[]>("volunteers", { default: [] });

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const teams = ref<Team[]>([]);
const excludedTeams = ref<Team[]>([]);

const addVolunteersFromTeams = () => {
  if (teams.value.length === 0) return;

  const excludeIncludedTeam = excludedTeams.value.some(
    ({ code: excludedCode }) =>
      teams.value.some(({ code }) => excludedCode === code),
  );
  if (excludeIncludedTeam) {
    sendInfoNotification("Ah c'est bien malin ça 😅");
  }

  const volunteersFromTeam = userStore.volunteers.filter(
    (volunteer) =>
      teams.value.every(({ code }) => volunteer.teams.includes(code)) &&
      !excludedTeams.value.some(({ code }) => volunteer.teams.includes(code)),
  );

  const uniqueVolunteersFromTeam = volunteersFromTeam.filter(
    (volunteer) =>
      !volunteers.value.find(
        (selectedVolunteer) => selectedVolunteer.id === volunteer.id,
      ),
  );

  volunteers.value.push(...uniqueVolunteersFromTeam);
  teams.value = [];
  excludedTeams.value = [];

  selectVolunteers();
};

const emit = defineEmits(["apply"]);
const selectVolunteers = () => emit("apply");
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__line {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.fixed-width-field {
  flex: 1 1 0;
}
</style>
