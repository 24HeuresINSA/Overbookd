<template>
  <v-layout>
    <v-main>
      <div
        :class="{
          'watermark-preprod': isPreProd(),
          'watermark-ctma': isCetaitMieuxAvant(),
        }"
      >
        <slot />
      </div>
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { useFavicon } from "@vueuse/core";
import { isCetaitMieuxAvant, isPreProd } from "~/utils/navigation/url.constant";

const favicon = useFavicon();

if (isPreProd()) favicon.value = "/favicon-preprod.ico";
if (isCetaitMieuxAvant()) favicon.value = "/favicon-ctma.ico";
</script>

<style lang="scss" scoped>
@use "~/assets/watermark.scss" as *;
</style>
