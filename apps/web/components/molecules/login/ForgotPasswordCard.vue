<template>
  <v-card>
    <v-card-title>Ben alors, on oublie son mot de passe ?</v-card-title>
    <v-card-text>
      <v-img
        max-height="200"
        src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmp1dGthNXE3em44ZjVhdmxsZ3dyZTZuZjRsbnpkZm93cHJ0eTM0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cO39srN2EUIRaVqaVq/giphy.gif"
      />
      <p class="mt-3">
        Ecris nous l'email de ton compte pour qu'on t'envoie un lien de
        réinitialisation.
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
    </v-card-text>
    <v-card-actions>
      <v-btn
        variant="elevated"
        size="large"
        color="primary"
        :disabled="isNotValid"
        @click="sendResetRequest"
      >
        Envoyer le mail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { required, isEmail, isInsaEmail } from "~/utils/rules/input.rules";

const email = ref("");

const authStore = useAuthStore();
const emit = defineEmits(["close"]);

const rules = {
  required,
  email: isEmail,
  insaEmail: isInsaEmail,
};

const isNotValid = computed(() => {
  const exists = email.value;
  const isEmail =
    rules.email(email.value) === true && rules.insaEmail(email.value) === true;
  return !exists || !isEmail;
});

const sendResetRequest = async () => {
  if (isNotValid.value) return;
  await authStore.requestPasswordReset(email.value);
  emit("close");
};
</script>
