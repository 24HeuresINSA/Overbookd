<template>
  <div class="trombinoscope">
    <v-progress-circular
      v-show="loading"
      class="loading"
      :size="100"
      :width="10"
      indeterminate
    />
    <div v-show="volunteersBornToday.length" class="birthdays">
      <BirthdayCard
        v-for="volunteer in volunteersBornToday"
        :key="volunteer.id"
        :volunteer="volunteer"
      />
    </div>
    <TrombinoscopeGroup
      heading="Conseil d'administration 🧑‍💼"
      :volunteers="caMembers"
      @click:team="propagateClickedTeam"
      @click:volunteer="propagateClickedVolunteer"
    />
    <TrombinoscopeGroup
      heading="Adhérents 🤡"
      :volunteers="adherents"
      @click:team="propagateClickedTeam"
      @click:volunteer="propagateClickedVolunteer"
    />
    <TrombinoscopeGroup
      heading="Bénévoles 😎"
      :volunteers="eventVolunteers"
      @click:team="propagateClickedTeam"
      @click:volunteer="propagateClickedVolunteer"
    />
    <TrombinoscopeGroup
      heading="EHPAD 🧓"
      :volunteers="seniors"
      @click:team="propagateClickedTeam"
      @click:volunteer="propagateClickedVolunteer"
    />

    <h3 v-show="allVolunteersDisplayed" class="easter-egg">
      🥵 Wow, t'as vraiment descendu toute la liste ! Tu cherches ton crush ou
      quoi ?
    </h3>
  </div>
</template>

<script lang="ts" setup>
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import {
  BUREAU_CODE,
  HARD_CODE,
  ORGA_CODE,
  SOFT_CODE,
  VIEUX_CODE,
} from "@overbookd/team-constants";
import { OverDate } from "@overbookd/time";
import type { Team } from "@overbookd/team";

const props = defineProps({
  volunteers: {
    type: Array as PropType<UserDataWithPotentialyProfilePicture[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();
const allVolunteersDisplayed = computed<boolean>(() => {
  const hasVolunteers = props.volunteers.length > 0;
  const noFilters = userStore.volunteers.length === props.volunteers.length;
  return hasVolunteers && noFilters;
});

const caMembers = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  props.volunteers.filter((volunteer) => {
    const isOrga = volunteer.teams.includes(ORGA_CODE);
    const isBureau = volunteer.teams.includes(BUREAU_CODE);
    return isOrga || isBureau;
  }),
);
const adherents = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  props.volunteers.filter((volunteer) => {
    const isNotOrga = !volunteer.teams.includes(ORGA_CODE);
    const isNotBureau = !volunteer.teams.includes(BUREAU_CODE);
    const isHard = volunteer.teams.includes(HARD_CODE);
    return isNotOrga && isNotBureau && isHard;
  }),
);
const eventVolunteers = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  props.volunteers.filter((volunteer) => volunteer.teams.includes(SOFT_CODE)),
);
const seniors = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  props.volunteers.filter((volunteer) => {
    const notHard = !volunteer.teams.includes(HARD_CODE);
    const isSenior = volunteer.teams.includes(VIEUX_CODE);
    return notHard && isSenior;
  }),
);

const volunteersBornToday = computed<UserDataWithPotentialyProfilePicture[]>(
  () => {
    const today = OverDate.now();
    return props.volunteers.filter((volunteer) => {
      const birthdate = OverDate.from(volunteer.birthdate);
      return (
        birthdate.monthlyDate.month === today.monthlyDate.month &&
        birthdate.monthlyDate.day === today.monthlyDate.day
      );
    });
  },
);

const emit = defineEmits(["click:team", "click:volunteer"]);
const propagateClickedTeam = (team: Team) => emit("click:team", team);
const propagateClickedVolunteer = (
  volunteer: UserDataWithPotentialyProfilePicture,
) => emit("click:volunteer", volunteer);
</script>

<style lang="scss" scoped>
.trombinoscope {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 15px;
}

.loading {
  margin: 50px auto;
  opacity: 0.5;
}

.birthdays {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 350px));
  gap: 15px;
  align-items: stretch;
  justify-content: center;
}

.easter-egg {
  text-align: center;
  margin: 20px 0;
}
</style>
