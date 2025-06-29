<template>
  <div class="background-wrapper">
    <v-img
      src="https://wordpress.24heures.org/wp-content/uploads/2022/01/img_24h_46e_photoorga.jpg"
      alt="Les organisateurs de la 46ème édition des 24 heures de l'INSA"
      class="background"
      cover
    />
    <StaffLinkExpiredAlert v-if="isInvitationExpired" class="alert" />
    <RegistrationStepper v-else class="stepper" />
  </div>
</template>

<script lang="ts" setup>
import { InviteStaff, LINK_EXPIRED } from "@overbookd/registration";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

definePageMeta({ layout: false });

const route = useRoute();

const token = computed<string>(() => stringifyQueryParam(route.query.token));

const isInvitationExpired = computed<boolean>(() => {
  if (!token.value) return false;
  const currentUrl = new URL(window.location.href);
  return InviteStaff.isLinkExpired(currentUrl) === LINK_EXPIRED;
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
