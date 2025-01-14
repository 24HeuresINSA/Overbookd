<template>
  <DesktopPageTitle :title="title" :desktop-only="false">
    <template #additional>
      <TeamChip
        v-for="team in selectedUser?.teams ?? []"
        :key="team"
        :team="team"
        :with-name="isDesktop"
      />
    </template>
  </DesktopPageTitle>
  <VolunteerPlanningCalendar
    v-if="selectedUser?.id"
    :volunteer="selectedUser"
  />
</template>

<script lang="ts" setup>
import { buildUserNameWithNickname } from "@overbookd/user";
import { HOME_URL } from "@overbookd/web-page";

const route = useRoute();
const layoutStore = useLayoutStore();
const userStore = useUserStore();

const userId = ref<number>(+route.params.userId);
const selectedUser = computed(() => userStore.selectedUser);

const isDesktop = computed<boolean>(() => layoutStore.isDesktop);

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
