<template>
  <v-card class="friends-card">
    <v-card-title class="friends-card__title">{{ title }}</v-card-title>
    <v-card-text class="friends-card__list">
      <v-list-item
        v-for="friend in selectedVolunteerFriends"
        :key="friend.id"
        class="friend-item"
        :value="friend.id"
        active
        :color="getFriendColor(friend)"
        @click="selectVolunteer(friend)"
        @contextmenu.prevent="openAssignmentPageInNewTab(friend.id)"
      >
        <v-tooltip
          location="top"
          :disabled="isAssignable(friend) && isDirectFriend(friend)"
        >
          <template #activator="{ props }">
            <span v-bind="props">
              {{ buildUserName(friend) }}
            </span>
          </template>
          <div v-if="!isAssignable(friend)">Non affectable</div>
          <div v-if="!isDirectFriend(friend)">
            N'est pas dans sa liste d'ami·e·s direct·e·s
          </div>
        </v-tooltip>
      </v-list-item>
      <v-list-item
        v-if="selectedVolunteerFriends.length === 0"
        class="friend-item"
      >
        Aucun·e ami·e 😭
      </v-list-item>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { type User, buildUserName } from "@overbookd/user";
import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { ASSIGNMENT_ORGA_TASK_URL } from "@overbookd/web-page";
import type { AssignmentFriend } from "@overbookd/http";

const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();

const assignableVolunteers = computed<
  Map<number, VolunteerWithAssignmentDuration>
>(() => assignVolunteerToTaskStore.volunteers);
const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
const title = computed<string>(() => {
  const volunteerName = selectedVolunteer.value?.firstName ?? "...";
  return `Amis de ${volunteerName} :`;
});

const isAssignable = (friend: AssignmentFriend): boolean =>
  assignableVolunteers.value.has(friend.id);
const isDirectFriend = (friend: AssignmentFriend): boolean =>
  friend.isDirectFriend;
const getFriendPriority = (friend: AssignmentFriend): number => {
  const nonAssignableScore = isAssignable(friend) ? 0 : 2;
  const nonDirectFriendScore = isDirectFriend(friend) ? 0 : 1;
  return nonAssignableScore + nonDirectFriendScore;
};
const getFriendColor = (friend: AssignmentFriend): string | undefined => {
  const isNotAssignable = !isAssignable(friend);
  const isNotDirectFriend = !isDirectFriend(friend);
  if (isNotAssignable && isNotDirectFriend) return "error";
  if (isNotAssignable) return "warning";
  if (isNotDirectFriend) return "blue";
  return undefined;
};
const selectedVolunteerFriends = computed<AssignmentFriend[]>(() =>
  assignVolunteerToTaskStore.selectedVolunteerFriends.sort(
    (a, b) => getFriendPriority(a) - getFriendPriority(b),
  ),
);

const emit = defineEmits(["select-volunteer"]);

const selectVolunteer = (friend: User) => {
  const volunteer = assignableVolunteers.value.get(friend.id);
  if (!volunteer) return;
  emit("select-volunteer", volunteer);
};

const openAssignmentPageInNewTab = (id: number) => {
  const isAssignableVolunteer = assignableVolunteers.value.has(id);
  if (!isAssignableVolunteer) return;
  window.open(`${ASSIGNMENT_ORGA_TASK_URL}?volunteer=${id}`);
};
</script>
<style lang="scss" scoped>
@use "~/assets/assignment.scss" as *;

.friends-card {
  width: 100%;
  height: $volunteer-list-friends-card-height;
  display: flex;
  flex-direction: column;
  border: 1px solid;
  margin: 0 !important;
  &__title {
    padding: 8px 16px 4px 16px;
  }
  &__list {
    overflow-y: scroll;
    .friend-item {
      min-height: 32px;
    }
  }
}
</style>
