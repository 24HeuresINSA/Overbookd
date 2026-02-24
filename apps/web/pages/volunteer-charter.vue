<template>
  <div class="charter-wrapper">
    <v-card class="charter-card">
      <v-card-text>
        <VolunteerCharter
          :should-sign="shouldSign"
          :has-signed="hasSigned"
          @sign="signVolunteerCharter"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { MUST_SIGN_VOLUNTEER_CHARTER } from "@overbookd/permission";

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


<style lang="scss" scoped>

.charter-wrapper {
  display: flex;
  justify-content: center;
}

.charter-card {
  width: 80%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}
</style>
