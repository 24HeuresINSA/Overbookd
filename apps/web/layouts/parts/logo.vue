<template>
  <nuxt-link class="application" to="/">
    <img class="logo" :src="`/img/logo/${logo}`" @click="increment" />
    <span class="version"> {{ version }}</span>
  </nuxt-link>
</template>

<script lang="ts">
import Vue from "vue";

const version = process.env.OVERBOOKD_VERSION;
const TWENTY_FOUR = 24;
const FIFTY_ONE = 51;

export default Vue.extend({
  name: "Logo",
  data: () => ({
    counter: 0,
  }),
  computed: {
    version(): string {
      return `v${version}` ?? "";
    },
    logo(): string {
      if (this.counter >= FIFTY_ONE) return "Pastis.png";
      if (this.counter >= TWENTY_FOUR) return "Ricard.png";
      return "overbookd_logo_noir.png";
    },
    track(): string {
      return "audio/jaune.m4a";
    },
  },
  watch: {
    counter(counter: number) {
      if (counter !== TWENTY_FOUR) return;
      const audio = new Audio(this.track);
      audio.play();
    },
  },
  methods: {
    increment() {
      this.counter = this.counter + 1;
    },
  },
});
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
