<template>
  <div class="background-wrapper">
    <v-img
      src="/registration/volunteers_on_main_stage.jpg"
      alt="Les organisateurs de la 50ème édition des 24 heures de l'INSA"
      class="background"
      cover
    />
    <StaffLinkExpiredAlert v-if="isInvitationExpired" class="alert" />
    <RegistrationStepper v-else class="stepper" />
  </div>
</template>

<script lang="ts" setup>
import { LINK_EXPIRED } from "@overbookd/configuration";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

definePageMeta({ layout: false });

const route = useRoute();
const membershipApplicationStore = useMembershipApplicationStore();

const token = computed<string>(() => stringifyQueryParam(route.query.token));

const isInvitationExpired = computed<boolean>(() => {
  if (!token.value) return false;
  const isLinkExpired =
    membershipApplicationStore.inviteStaffLinkStatus === LINK_EXPIRED;
  return isLinkExpired;
});
</script>

<style scoped lang="scss">
.background-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
}

.alert {
  z-index: 2;
  flex: none;
  margin: 0.5em;
}

.stepper {
  position: relative;
  z-index: 2;
  height: 100%;
  margin: 0.5em;
}
</style>
