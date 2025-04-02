<template>
  <DesktopPageTitle />
  <VolunteerPlanningCalendar v-if="me?.id" :volunteer-id="me.id" />
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const me = computed(() => userStore.loggedUser);

useHead({ title: "Mon planning" });
</script>
