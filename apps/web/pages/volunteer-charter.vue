<template>
  <VolunteerCharter :should-sign="shouldSign" :has-signed="hasSigned" @sign="signVolunteerCharter" />
</template>

<script lang="ts" setup>
useHead({ title: "Charte bénévole" });

const userStore = useUserStore();

const shouldSign = computed<boolean>(() =>
  userStore.can(MUST_SIGN_VOLUNTEER_CHARTER),
);
const hasSigned = computed<boolean>(
  () => userStore.loggedUser?.hasSignedVolunteerCharter === true,
);

const signVolunteerCharter = async () => {
  if (!shouldSign.value) return;
  await userStore.signVolunteerCharter();
};
</script>
