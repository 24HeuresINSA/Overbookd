<template>
  <v-layout>
    <v-main>
      <div
        :class="{
          'watermark-preprod': isPreProd,
          'watermark-ctma': isCetaitMieuxAvant,
        }"
      >
        <slot />
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useFavicon } from "@vueuse/core";
import { CETAITMIEUXAVANT, PREPROD } from "~/utils/navigation/url.constant";

const config = useRuntimeConfig();
const url: string = config.public.baseURL;
const favicon = useFavicon();

const isPreProd: boolean = url.includes(PREPROD);
const isCetaitMieuxAvant: boolean = url.includes(CETAITMIEUXAVANT);
if (isPreProd) favicon.value = "/favicon-preprod.ico";
if (isCetaitMieuxAvant) favicon.value = "/favicon-ctma.ico";
</script>

<style lang="scss" scoped>
@use "~/assets/watermark.scss" as *;
</style>
