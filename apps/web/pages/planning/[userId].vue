<template>
  <DesktopPageTitle :title="title" />
  <VolunteerPlanningCalendar
    v-if="selectedUser?.id"
    :volunteer="selectedUser"
  />
</template>

<script lang="ts" setup>
import { buildUserNameWithNickname } from "@overbookd/user";
import { HOME_URL } from "@overbookd/web-page";

const route = useRoute();
const userStore = useUserStore();

const userId = ref<number>(+route.params.userId);

const selectedUser = computed(() => userStore.selectedUser);

onMounted(async () => {
  if (isNaN(userId.value)) return navigateTo(HOME_URL);
  await userStore.findUserById(userId.value);
});

const title = computed<string>(() => {
  if (!selectedUser.value) return "Planning";
  return `Planning de ${buildUserNameWithNickname(selectedUser.value)}`;
});
watch(selectedUser, () => (document.title = title.value));
</script>
