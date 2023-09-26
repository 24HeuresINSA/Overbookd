<template>
  <nuxt-link class="application" to="/">
    <img class="logo" :src="`/img/logo/${logo}`" @click="increment" />
    <span class="version"> {{ version }}</span>
  </nuxt-link>
</template>

<script lang="ts">
import Vue from "vue";

const version = process.env.OVERBOOKD_VERSION;

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
      if (this.counter >= 51) return "Pastis.png";
      if (this.counter >= 24) return "Ricard.png";
      return "overbookd_logo_noir.png";
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
