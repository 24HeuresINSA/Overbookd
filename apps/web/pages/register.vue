<template>
  <div class="background-wrapper">
    <v-img
      src="/registration/volunteers_on_main_stage.jpg"
      alt="Les organisateur·rice·s de la 50ème édition des 24 heures de l'INSA"
      class="background"
      cover
    />
    <StaffLinkExpiredAlert v-if="isInvitationExpired" class="content" />
    <RegistrationStepper v-else :token class="content" />
  </div>
</template>

<script lang="ts" setup>
import { InviteStaff, LINK_EXPIRED } from "@overbookd/registration";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import {
  getStaffToken,
  removeStaffToken,
  saveStaffToken,
} from "~/utils/registration/staff-token";

definePageMeta({ layout: "unauthenticated" });

const route = useRoute();

const token = computed<string>(() => {
  const token = stringifyQueryParam(route.query.token);
  if (token) {
    if (InviteStaff.isTokenExpired(token) !== LINK_EXPIRED)
      saveStaffToken(token);
    return token;
  }

  const savedToken = getStaffToken();
  if (InviteStaff.isTokenExpired(savedToken) === LINK_EXPIRED)
    removeStaffToken();

  return savedToken;
});

const isInvitationExpired = computed<boolean>(() => {
  if (!token.value) return false;
  return InviteStaff.isTokenExpired(token.value) === LINK_EXPIRED;
});
</script>

<style lang="scss" scoped>
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

.content {
  z-index: 2;
  margin: 1em !important;
}
</style>
