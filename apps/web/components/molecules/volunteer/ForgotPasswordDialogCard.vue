<template>
  <DialogCard theme="loginTheme" @close="close">
    <template #title>Ben alors, on oublie son mot de passe ?</template>
    <template #content>
      <v-img
        max-height="200"
        src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmp1dGthNXE3em44ZjVhdmxsZ3dyZTZuZjRsbnpkZm93cHJ0eTM0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cO39srN2EUIRaVqaVq/giphy.gif"
        alt="Nelson des Simpsons qui se moque de toi"
      />
      <p class="my-3">
        Renseigne l'email de ton compte pour recevoir un lien de
        réinitialisation de mot de passe.
      </p>
      <v-text-field
        v-model="email"
        label="Ton email"
        autocomplete="email"
        inputmode="email"
        :rules="[rules.required, rules.email, rules.insaEmail]"
        autofocus
        @keydown.enter="sendResetRequest"
      />
    </template>
    <template #actions>
      <v-btn
        text="Envoyer le mail"
        size="large"
        :disabled="isNotValid"
        @click="sendResetRequest"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { required, isEmail, isInsaEmail } from "~/utils/rules/input.rules";

const email = ref<string>("");

const authStore = useAuthStore();

const rules = {
  required,
  email: isEmail,
  insaEmail: isInsaEmail,
};

const isNotValid = computed<boolean>(() => {
  const exists = email.value;
  const isEmail =
    rules.email(email.value) === true && rules.insaEmail(email.value) === true;
  return !exists || !isEmail;
});

const emit = defineEmits(["close"]);
const close = () => emit("close");

const sendResetRequest = async () => {
  if (isNotValid.value) return;
  await authStore.requestPasswordReset(email.value);
  close();
};
</script>
