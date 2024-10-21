<template>
  <DialogCard @close="close">
    <template #title> Ajouter une mobilisation </template>

    <template #subtitle>
      La manif commencera le {{ displayedManifDate }}.
    </template>

    <template #content>
      <MobilizationPeriodFormFields
        v-model:start="start"
        v-model:end="end"
        v-model:duration-split-in-hour="durationSplitInHour"
      />

      <h3>Ajouter un bénévole</h3>
      <div v-show="volunteers.length > 0" class="chip-group">
        <v-chip
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          size="small"
          closable
          @click:close="removeVolunteer(volunteer.id)"
        >
          {{ buildUserNameWithNickname(volunteer) }}
        </v-chip>
      </div>
      <SearchUser
        :model-value="volunteerToAdd"
        :list="addableVolunteers"
        class="mt-2"
        hide-details
        @update:model-value="addVolunteer"
      />

      <h3>Ajouter des bénévoles d'une équipe</h3>
      <div v-show="teams.length > 0" class="chip-group">
        <TeamChip
          v-for="team in teams"
          :key="team.team"
          :team="team.team"
          :prefix="team.count.toString()"
          with-name
          show-hidden
          closable
          @close="removeTeam(team)"
        />
      </div>
      <div class="team-form">
        <v-text-field
          v-model="teamQuantity"
          type="number"
          label="Nombre de bénévoles"
          class="team-form__field"
          :rules="[isNumber, min(1)]"
          hide-details
        />
        <SearchTeam
          v-model="teamToAdd"
          :list="mobilizableTeams"
          label="Équipe à ajouter"
          class="team-form__field"
          hide-details
          @update:model-value="addTeam"
        />
      </div>
    </template>

    <template #actions>
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        text="Ajouter la mobilisation"
        :disabled="!canAddMobilization"
        color="primary"
        size="large"
        @click="addMobilization"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { Period, formatDate } from "@overbookd/time";
import type { TeamMobilization } from "@overbookd/festival-event";
import type { AddMobilizationForm } from "@overbookd/http";
import type { Team } from "@overbookd/team";
import { isNumber, min } from "~/utils/rules/input.rules";
import { type User, buildUserNameWithNickname } from "@overbookd/user";

const userStore = useUserStore();
const teamStore = useTeamStore();
const configurationStore = useConfigurationStore();

const eventStartDate = computed<Date>(() => configurationStore.eventStartDate);

const start = ref<Date>(eventStartDate.value);
const end = ref<Date>(eventStartDate.value);
const durationSplitInHour = ref<number | null>(null);
const teams = ref<TeamMobilization[]>([]);
const volunteers = ref<User[]>([]);
const volunteerToAdd = ref<User | undefined>();
const teamToAdd = ref<Team | undefined>();
const teamQuantity = ref<number>(1);

const displayedManifDate = computed<string>(
  () => `vendredi ${formatDate(eventStartDate.value)}`,
);

const emit = defineEmits(["add", "close"]);
const close = () => emit("close");

const mobilizableTeams = computed<Team[]>(() => teamStore.mobilizableTeams);
const addTeam = (team: Team | null) => {
  if (!team) return;
  const count = +teamQuantity.value;
  teams.value = [...teams.value, { team: team.code, count }];

  teamQuantity.value = 1;
  teamToAdd.value = undefined;
};
const removeTeam = (toRemove: TeamMobilization) => {
  teams.value = teams.value.filter(
    ({ team }: TeamMobilization) => team !== toRemove.team,
  );
};

userStore.fetchVolunteers();
const addableVolunteers = computed<User[]>(() =>
  userStore.volunteers.filter(
    (volunteer) =>
      !volunteers.value.some(({ id }: User) => id === volunteer.id),
  ),
);
const addVolunteer = (volunteer: User | null) => {
  if (!volunteer) return;
  volunteers.value = [...volunteers.value, volunteer];
  volunteerToAdd.value = undefined;
};
const removeVolunteer = (volunteerId: User["id"]) => {
  volunteers.value = volunteers.value.filter((v: User) => v.id !== volunteerId);
};

const cleanData = () => {
  start.value = eventStartDate.value;
  end.value = eventStartDate.value;
  durationSplitInHour.value = null;
  teams.value = [];
  volunteers.value = [];
  volunteerToAdd.value = undefined;
  teamToAdd.value = undefined;
  teamQuantity.value = 1;
};

const canAddMobilization = computed<boolean>(() => {
  const isPeriodValid = Period.isValid({
    start: start.value,
    end: end.value,
  });
  const isDurationValid =
    durationSplitInHour.value === null || durationSplitInHour.value > 0;
  return isPeriodValid && isDurationValid;
});
const addMobilization = () => {
  if (!canAddMobilization.value) return;

  const mobilization: AddMobilizationForm = {
    start: start.value,
    end: end.value,
    durationSplitInHour: durationSplitInHour.value,
    teams: teams.value,
    volunteers: volunteers.value.map(({ id }: User) => id),
  };

  emit("add", mobilization);
  close();
  cleanData();
};
</script>

<style lang="scss" scoped>
.team-form {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  &__field {
    width: 100%;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}

.chip-group {
  margin-bottom: 5px;
  margin-top: 2px;
}

h3 {
  padding-top: 15px;
}
</style>
