<template>
  <div class="login-page">
    <v-img :src="image" class="background" cover />

    <div class="login-card-container">
      <v-card class="login-card" theme="loginTheme">
        <v-card-text class="login-card__content">
          <v-tooltip location="bottom">
            <template #activator="{ props }">
              <v-img
                v-bind="props"
                src="/img/logo/logo_home.png"
                class="logo"
              />
            </template>
            Version {{ version }}
          </v-tooltip>
          <h1 class="login-card__title">Bienvenue aux 24h de l'INSA 👋</h1>

          <div class="login-form">
            <label for="email" class="login-form__input-label">Email</label>
            <v-text-field
              v-model="credentials.email"
              autocomplete="email"
              inputmode="email"
              name="email"
              class="login-form__input"
              placeholder="Email"
              density="compact"
              autofocus
              hide-details
              @keydown.enter="login"
            />

            <label for="password" class="login-form__input-label">
              Mot de passe
            </label>
            <v-text-field
              v-model="credentials.password"
              type="password"
              name="password"
              class="login-form__input"
              placeholder="Mot de passe"
              density="compact"
              clearable
              hide-details
              @keydown.enter="login"
            />

            <a
              text="Mot de passe oublié ?"
              class="login-form__forgot-label link"
              @click="openForgotDialog"
            />

            <v-btn
              text="Connexion"
              size="large"
              color="primary"
              class="login-form__button text-none"
              flat
              @click="login"
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

  <v-dialog v-model="isForgotDialogOpen" max-width="600">
    <ForgotPasswordDialogCard @close="closeForgotDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
import { ONE_SECOND_IN_MS } from "@overbookd/time";
import { HOME_URL, REGISTER_URL } from "@overbookd/web-page";
import { pickRandomBackground } from "~/domain/login/login";

definePageMeta({ layout: false });

const config = useRuntimeConfig();
const version = config.public.version;

const route = useRoute();
const authStore = useAuthStore();

const token = computed<string | undefined>(() => {
  const tokenParam = route.query.token;
  return Array.isArray(tokenParam) ? undefined : (tokenParam ?? undefined);
});
const registerLink = computed<string>(() =>
  token.value ? `${REGISTER_URL}?token=${token.value}` : REGISTER_URL,
);
const register = () => navigateTo(registerLink.value);

const credentials = ref({
  email: "",
  password: "",
});

const image = ref(pickRandomBackground());

setInterval(
  () => (image.value = pickRandomBackground(image.value)),
  10 * ONE_SECOND_IN_MS,
);

const login = async () => {
  if (!credentials.value.email.trim() || !credentials.value.password.trim()) {
    return sendFailureNotification(
      "Hmmm, t'aurais pas oublié de remplir quelque chose ?",
    );
  }
  await authStore.login(credentials.value);
  if (authStore.authenticated) navigateTo(HOME_URL);
};

const isForgotDialogOpen = ref<boolean>(false);
const openForgotDialog = () => (isForgotDialogOpen.value = true);
const closeForgotDialog = () => (isForgotDialogOpen.value = false);
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
  @media screen and (max-width: $mobile-max-width) {
    width: $mobile-card-content-width;
  }

  &__input-label {
    margin: 20px 0 3px;
    font-weight: 500;
  }
  &__forgot-label {
    margin: 10px 0 15px;
    text-align: right;
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
