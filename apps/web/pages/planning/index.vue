<template>
  <DesktopPageTitle />
  <VolunteerPlanningCalendar v-if="me?.id" :volunteer-id="me.id" />
</template>

<script lang="ts" setup>
const myStore = useMyStore();
const me = computed(() => myStore.loggedUser);

useHead({ title: "Mon planning" });
</script>
