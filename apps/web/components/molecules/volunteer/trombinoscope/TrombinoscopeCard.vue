<template>
  <v-card
    class="profile-picture-card"
    :ripple="canViewVolunteerDetails"
    :class="{ unclickable: !canViewVolunteerDetails }"
    @click="propagateClickedVolunteer"
  >
    <v-card-title class="name-with-picture">
      <ProfilePicture size="large" :user="volunteer" />
      <span class="name">{{ buildUserNameWithNickname(volunteer) }}</span>
    </v-card-title>
    <v-card-subtitle opacity="1">
      <div class="teams">
        <TeamChip
          v-for="team of volunteer.teams"
          :key="team"
          :team="team"
          clickable
          @click="propagateClickedTeam"
        />
      </div>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts" setup>
import { buildUserNameWithNickname } from "@overbookd/user";
import type { Team } from "@overbookd/team";
import { VIEW_VOLUNTEER_DETAILS } from "@overbookd/permission";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

const props = defineProps({
  volunteer: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
});

const userStore = useUserStore();
const canViewVolunteerDetails = computed(() =>
  userStore.can(VIEW_VOLUNTEER_DETAILS),
);

const emit = defineEmits(["click:team", "click:volunteer"]);
const propagateClickedTeam = (team: Team) => emit("click:team", team);
const propagateClickedVolunteer = () => {
  emit("click:volunteer", props.volunteer);
};
</script>

<style lang="scss" scoped>
.name {
  font-size: 1.1rem;
  text-wrap: wrap;
  text-align: center;
}

.teams {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
}

.profile-picture-card {
  display: flex;
  flex-direction: column;
  .name-with-picture {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
