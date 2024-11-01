<template>
  <v-card class="friends-card">
    <v-card-title class="friends-card__title">{{ title }}</v-card-title>
    <v-card-text class="friends-card__list">
      <v-list-item-group>
        <v-list-item
          v-for="friend in selectedVolunteerFriends"
          :key="friend.id"
          class="friend-item"
          :value="friend.id"
          @click="selectVolunteer(friend)"
          @contextmenu.prevent="openAssignmentPageInNewTab(friend.id)"
        >
          {{ buildUserName(friend) }}
        </v-list-item>
        <v-list-item
          v-if="selectedVolunteerFriends.length === 0"
          class="friend-item"
        >
          Aucun ami 😭
        </v-list-item>
      </v-list-item-group>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import { type User, buildUserName } from "@overbookd/user";
import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { ASSIGNMENT_ORGA_TASK_URL } from "@overbookd/web-page";
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
const selectedVolunteerFriends = computed<User[]>(
  () => assignVolunteerToTaskStore.selectedVolunteerFriends,
);
const title = computed<string>(() => {
  const volunteerName = selectedVolunteer.value?.firstname ?? "...";
  return `Amis de ${volunteerName} :`;
});
const emit = defineEmits(["select-volunteer"]);
const selectVolunteer = (friend: User) => {
  const volunteer = assignVolunteerToTaskStore.volunteers.find(
    (volunteer) => volunteer.id === friend.id,
  );
  if (!volunteer) return;
  emit("select-volunteer", volunteer);
};
const openAssignmentPageInNewTab = (id: number) => {
  window.open(`${ASSIGNMENT_ORGA_TASK_URL}?volunteer=${id}`, "_blank");
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
      min-height: 36px;
    }
  }
}
</style>
