<template>
  <div class="login-page">
    <v-img
      :src="image"
      alt="Image de présentation du festival des 24 heures de l'INSA"
      class="background"
      cover
    >
      <template #error>
        <v-img
          :src="GLASS"
          alt="Un verre des 24 heures de l'INSA avec la grande scène floue en arière plan"
          class="background"
          cover
        />
      </template>
    </v-img>

    <div class="login-card-container">
      <v-card class="login-card" theme="loginTheme">
        <v-card-text class="login-card__content">
          <v-img
            v-tooltip:bottom="`Version ${version}`"
            src="/img/logo/logo_home.png"
            alt="Logo OverBookd"
            class="logo"
          />
          <h1 class="login-card__title">Bienvenue aux 24h de l'INSA 👋</h1>

          <div class="login-form">
            <v-btn
              text="Me connecter"
              size="large"
              color="primary"
              class="text-none"
              flat
              @click="login('zitadel')"
            />

            <p class="login-form__not-registered-label">
              Pas de compte ?
              <a text="Inscription" class="link" @click="register" />
            </p>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ONE_SECOND_IN_MS } from "@overbookd/time";
import { REGISTER_URL } from "@overbookd/web-page";
import { pickRandomBackground, GLASS } from "~/domain/login/pictures";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

definePageMeta({ layout: false });

const config = useRuntimeConfig();
const version = config.public.version;

const route = useRoute();
const { login } = useOidcAuth();

const token = computed<string>(() => stringifyQueryParam(route.query.token));
const register = () => {
  const query = token.value ? { token: token.value } : {};
  navigateTo({ path: REGISTER_URL, query });
};

const image = ref<string>(pickRandomBackground());
setInterval(
  () => (image.value = pickRandomBackground(image.value)),
  10 * ONE_SECOND_IN_MS,
);
</script>

<style lang="scss" scoped>
$desktop-card-content-width: 380px;
$mobile-card-content-width: 80%;

.login-page {
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

.login-card-container {
  width: 100%;
  max-width: 1440px;
  height: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: $mobile-max-width) {
    justify-content: center;
  }
}

.login-card {
  width: 100%;
  max-width: 580px;
  height: fit-content;
  max-height: 100%;
  z-index: 2;
  display: flex;
  justify-content: center;
  gap: 5px;
  overflow-y: auto;

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
  &__title {
    text-align: center;
    @media screen and (max-width: $mobile-max-width) {
      font-size: 1.4rem;
    }
  }
}

.logo {
  width: 200px;
  margin: 15px;
  @media screen and (max-width: $mobile-max-width) {
    width: 160px;
    margin: 5px;
    margin-bottom: 10px;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  width: $desktop-card-content-width;
  margin-top: 20px;
  @media screen and (max-width: $mobile-max-width) {
    width: $mobile-card-content-width;
  }

  &__not-registered-label {
    margin: 20px 0;
    text-align: center;
    font-size: 1rem;
  }
}

.link {
  color: blue;
  cursor: pointer;
}
</style>
