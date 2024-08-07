<template>
  <header>
    <Logo />
    <span class="watermark">{{ watermark }}</span>
    <HeaderProfile />
  </header>
</template>

<script lang="ts" setup>
import Logo from "./Logo.vue";
import HeaderProfile from "~/layouts/parts/HeaderProfile.vue";

const config = useRuntimeConfig();

const url: string = config.public.baseURL;

const isPreProd: boolean = url.includes("preprod");
const isCetaitMieuxAvant: boolean = url.includes("cetaitmieuxavant");

const watermark = computed<string>(() =>
  isPreProd ? "preprod" : isCetaitMieuxAvant ? "ctma" : "",
);
</script>

<style lang="scss" scoped>
header {
  z-index: 10;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  background-color: rgb(var(--v-theme-surface));
  height: $header-height;
  @media only screen and (max-width: $mobile-max-width) {
    height: $mobile-header-height;
  }

  .watermark {
    text-transform: uppercase;
    color: #ec0000;
    font-size: 50px;
    font-weight: 500;
    opacity: 1;
    animation: wiggle 2s infinite;
  }

  @keyframes wiggle {
    0% {
      transform: rotate(0deg);
    }
    80% {
      transform: rotate(0deg);
    }
    85% {
      transform: rotate(5deg);
    }
    95% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
}
</style>
