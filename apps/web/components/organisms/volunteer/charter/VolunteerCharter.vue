<template>
  <div> TODO </div>
  <div v-if="shouldSign">
    <v-btn text="Signer la Charte Bénévole" color="success" :disabled="hasSigned" @click="signVolunteerCharter" />
    <p v-if="hasSigned">La Charte Bénévole est signée 🥳</p>
  </div>
</template>

<script lang="ts" setup>
import { MUST_SIGN_VOLUNTEER_CHARTER } from "@overbookd/permission";

const userStore = useUserStore();

const emit = defineEmits(["signed"]);

const shouldSign = computed<boolean>(() => 
  userStore.can(MUST_SIGN_VOLUNTEER_CHARTER)
);
const hasSigned = computed<boolean>(() => 
  userStore.loggedUser?.hasSignedVolunteerCharter
);

const signVolunteerCharter = async () => {
  if (!shouldSign.value) return;
  await userStore.signVolunteerCharter();
  if (hasSigned.value) emit("signed");
}
</script>
