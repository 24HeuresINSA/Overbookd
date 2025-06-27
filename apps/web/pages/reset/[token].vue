<template>
  <div class="reset-password-page">
    <v-img
      src="https://live.staticflickr.com/65535/53033819508_78a3ef2495_b.jpg"
      alt="Arche de la course des 24 heures de l'INSA de nuit en exposition longue avec les trainées des lumières des cyclistes"
      class="background"
      cover
    />

    <v-card class="reset-card" theme="loginTheme">
      <v-card-text class="reset-card__content">
        <h1 class="reset-card__title">Changement du mot de passe</h1>

        <div class="reset-form">
          <v-text-field
            v-model="password"
            label="Nouveau mot de passe"
            type="password"
            bg-color="white"
            class="reset-form__input"
            :rules="[rules.required, rules.password]"
            autofocus
          />
          <v-text-field
            v-model="password2"
            label="Confirme ton nouveau mot de passe"
            type="password"
            bg-color="white"
            class="reset-form__input"
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
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { HOME_URL } from "@overbookd/web-page";
import {
  required,
  password as passwordRule,
  isSame,
} from "~/utils/rules/input.rules";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

definePageMeta({ layout: false });

const route = useRoute();
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
  await navigateTo(HOME_URL);
};
</script>

<style lang="scss" scoped>
$desktop-card-content-width: 380px;
$mobile-card-content-width: 80%;

.reset-password-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2%;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
}

.reset-card {
  width: 100%;
  max-width: 580px;
  height: fit-content;
  max-height: 100%;
  z-index: 2;
  display: flex;
  justify-content: center;
  gap: 5px;
  overflow-y: auto;

  &__title {
    text-align: center;
    margin: 0 0 15px;
    @media screen and (max-width: $mobile-max-width) {
      font-size: 1.4rem;
    }
  }
  &__content {
    width: $desktop-card-content-width;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: $mobile-max-width) {
      width: $mobile-card-content-width;
    }
  }
}

.reset-form {
  display: flex;
  flex-direction: column;
  width: $desktop-card-content-width;
  @media screen and (max-width: $mobile-max-width) {
    width: $mobile-card-content-width;
  }
  &__input {
    margin-bottom: 15px;
  }
}
</style>
