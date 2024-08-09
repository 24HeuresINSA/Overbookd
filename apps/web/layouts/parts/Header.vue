<template>
  <v-app-bar class="header" flat>
    <template #prepend>
      <Logo v-if="isDesktop" />
      <v-app-bar-nav-icon v-else @click.stop="updateNav" />
    </template>

    <v-app-bar-title class="header__title">
      <v-tooltip v-if="isDesktop" location="bottom">
        <template #activator="{ props }">
          <span v-bind="props" class="watermark">
            {{ watermark }}
          </span>
        </template>
        <p>{{ watermarkTooltipTitle }}</p>
        <p>{{ watermarkTooltipDescription }}</p>
      </v-tooltip>
    </v-app-bar-title>

    <template #append>
      <HeaderProfile />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import Logo from "./Logo.vue";
import HeaderProfile from "~/layouts/parts/HeaderProfile.vue";
import { isDesktop as checkDesktop } from "~/utils/device/device.utils";

const PREPROD_TOOLTIP_TITLE =
  "Tu es sur la version de pré-production d'Overbookd.";
const PREPROD_TOOLTIP_DESCRIPTION =
  "Les modifications faites sur ce site n'auront pas d'impact sur la version de production.";
const CTMA_TOOLTIP_TITLE =
  "Tu es sur la version \"C'était Mieux Avant\" d'Overbookd.";
const CTMA_TOOLTIP_DESCRIPTION =
  "Le site et les données sont une copie d'Overbookd de l'année précédente.";

const isDesktop = checkDesktop();

const config = useRuntimeConfig();
const url: string = config.public.baseURL;

const isPreProd: boolean = url.includes("preprod");
const isCetaitMieuxAvant: boolean = url.includes("cetaitmieuxavant");

const watermark = computed<string>(() =>
  isPreProd ? "preprod" : isCetaitMieuxAvant ? "ctma" : "",
);
const watermarkTooltipTitle = computed<string>(() =>
  isPreProd
    ? PREPROD_TOOLTIP_TITLE
    : isCetaitMieuxAvant
      ? CTMA_TOOLTIP_TITLE
      : "",
);
const watermarkTooltipDescription = computed<string>(() =>
  isPreProd
    ? PREPROD_TOOLTIP_DESCRIPTION
    : isCetaitMieuxAvant
      ? CTMA_TOOLTIP_DESCRIPTION
      : "",
);

const emit = defineEmits(["update-nav"]);
const updateNav = () => emit("update-nav");
</script>

<style lang="scss" scoped>
.header {
  &__title {
    text-align: center;
    align-content: center;
    height: 100%;

    .watermark {
      text-transform: uppercase;
      color: #ec0000;
      font-size: 2.8rem;
      font-weight: 500;
      line-height: 1;
      @media only screen and (max-width: $mobile-max-width) {
        display: none;
      }
    }
  }
}
</style>
