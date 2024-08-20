<template>
  <div class="application">
    <nuxt-link class="application__link" :to="HOME_URL">
      <img class="logo" :src="`/img/logo/${logo}`" @click="onClick" />
      <span class="version">{{ versionString }}</span>
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";
import { HOME_URL } from "@overbookd/web-page";
import { isDesktop } from "~/utils/device/device.utils";
import { pickRandomTheme } from "~/utils/vuetify/theme/theme.utils";

const TWENTY_FOUR = 24;
const FIFTY_ONE = 51;

const theme = useTheme();
const themeStore = useThemeStore();

const config = useRuntimeConfig();
const versionString = computed<string>(() => `v${config.public.version}`);

const counter = ref<number>(0);

const isDarkTheme = computed<boolean>(() => themeStore.isDark);
const logo = computed<string>(() => {
  if (counter.value >= FIFTY_ONE) return "Pastis.png";
  if (counter.value >= TWENTY_FOUR) return "Ricard.png";

  if (isDesktop()) {
    return isDarkTheme.value ? "logo_desktop_white.png" : "logo_desktop.png";
  }
  return isDarkTheme.value ? "logo_mobile_white.png" : "logo_mobile.png";
});

const track = "audio/jaune.m4a";

watch(counter, (newCounter) => {
  if (newCounter !== TWENTY_FOUR) return;
  const audio = new Audio(track);
  audio.play();
});

const onClick = () => {
  counter.value++;

  const currentTheme = theme.global.name.value;
  theme.global.name.value = pickRandomTheme(currentTheme);
};
</script>

<style lang="scss" scoped>
.application {
  &__link {
    display: flex;
    gap: 6px;
    align-items: center;
    text-decoration: none;
    margin-left: 6px;

    .logo {
      max-width: 200px;
      max-height: 51px;
    }

    .version {
      margin-top: 2px;
      font-weight: 600;
      font-size: 0.9rem;
      color: rgb(var(--v-theme-on-surface));
      @media only screen and (max-width: $mobile-max-width) {
        display: none;
      }
    }
  }
}
</style>
