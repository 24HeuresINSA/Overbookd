<template>
  <DesktopPageTitle />
  <VolunteerPlanningCalendar v-if="me?.id" :volunteer="me" />
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const me = computed(() => userStore.loggedUser);

useHead({ title: "Mon planning" });
</script>
