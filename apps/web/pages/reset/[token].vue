<template>
  <v-img
    class="background"
    src="https://live.staticflickr.com/65535/53033819508_78a3ef2495_b.jpg"
    cover
  />
  <v-container class="form-container">
    <h1>Changement du mot de passe</h1>
    <v-text-field
      v-model="password"
      label="Nouveau mot de passe"
      type="password"
      bg-color="white"
      :rules="[rules.required, rules.password]"
      autofocus
    />
    <v-text-field
      v-model="password2"
      label="Confirme ton nouveau mot de passe"
      type="password"
      bg-color="white"
      :rules="[rules.required, repeatPasswordRule]"
      @keydown.enter="sendResetRequest"
    />
    <v-btn
      text="Enregistrer le mot de passe"
      color="primary"
      size="large"
      :disabled="isNotValid"
      @click="sendResetRequest"
    />
  </v-container>
</template>

<script lang="ts" setup>
import {
  required,
  password as passwordRule,
  isSame,
} from "~/utils/rules/input.rules";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

definePageMeta({ layout: false });

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const password = ref<string>("");
const password2 = ref<string>("");

const rules = { required, password: passwordRule };
const repeatPasswordRule = computed(() => isSame(password.value));

const isNotValid = computed<boolean>(() => {
  const exists = password.value && password2.value;
  const isPassword =
    rules.password(password.value) === true &&
    rules.password(password2.value) === true;
  const isSame = password.value === password2.value;
  return !exists || !isPassword || !isSame;
});

const sendResetRequest = async () => {
  if (isNotValid.value) return;
  const token = stringifyQueryParam(route.params.token);
  await authStore.resetPassword(token, password.value, password2.value);
  await router.push({ path: "/" });
};
</script>

<style>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: center;
  justify-self: center;
  z-index: 2;
  color: white;

  h1 {
    text-align: center;
  }
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
</style>
~/utils/festival-event/url-params.utils
