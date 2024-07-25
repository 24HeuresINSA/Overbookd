<template>
  <nuxt-link class="application" to="/">
    <img class="logo" :src="`/img/logo/${logo}`" @click="increment" />
    <span class="version">{{ versionString }}</span>
  </nuxt-link>
</template>

<script lang="ts" setup>
const TWENTY_FOUR = 24;
const FIFTY_ONE = 51;

const config = useRuntimeConfig();
const counter = ref<number>(0);

const versionString = computed<string>(() => `v${config.public.version}`);

const logo = computed<string>(() => {
  if (counter.value >= FIFTY_ONE) return "Pastis.png";
  if (counter.value >= TWENTY_FOUR) return "Ricard.png";
  if (window.innerWidth <= 960) return "logo_mobile.png";
  return "logo_desktop.png";
});

const track = "audio/jaune.m4a";

watch(counter, (newCounter) => {
  if (newCounter === TWENTY_FOUR) {
    const audio = new Audio(track);
    audio.play();
  }
});

function increment() {
  counter.value++;
}
</script>

<style lang="scss" scoped>
.application {
  display: flex;
  gap: 3px;
  align-items: center;

  .logo {
    max-width: 200px;
    max-height: 51px;
  }

  .version {
    font-weight: 600;
    @media only screen and (max-width: $mobile-max-width) {
      display: none;
    }
  }
}
</style>
