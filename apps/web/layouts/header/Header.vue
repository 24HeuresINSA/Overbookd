<template>
  <v-app-bar class="header" height="60" flat>
    <template #prepend>
      <Logo class="desktop-only" />
      <v-app-bar-nav-icon class="mobile-only" @click.stop="updateNav" />
    </template>

    <v-app-bar-title class="header__title">
      <v-tooltip v-if="watermark" location="bottom" class="desktop-only">
        <template #activator="{ props }">
          <span v-bind="props" class="watermark">
            {{ watermark }}
          </span>
        </template>
        <p>{{ watermarkTooltipTitle }}</p>
        <p>{{ watermarkTooltipDescription }}</p>
      </v-tooltip>
      <span class="page-title mobile-only">{{ pageTitle }}</span>
    </v-app-bar-title>

    <template #append>
      <HeaderProfile />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import Logo from "./Logo.vue";
import HeaderProfile from "./HeaderProfile.vue";
import { findPage } from "~/utils/pages/navigation";

const PREPROD_TOOLTIP_TITLE =
  "Tu es sur la version de pré-production d'Overbookd.";
const PREPROD_TOOLTIP_DESCRIPTION =
  "Les modifications faites sur ce site n'auront pas d'impact sur la version de production.";
const CTMA_TOOLTIP_TITLE =
  "Tu es sur la version \"C'était Mieux Avant\" d'Overbookd.";
const CTMA_TOOLTIP_DESCRIPTION =
  "Le site et les données sont une copie d'Overbookd de l'année précédente.";

const route = useRoute();
const config = useRuntimeConfig();
const url: string = config.public.baseURL;

const isPreProd: boolean = url.includes("preprod");
const isCetaitMieuxAvant: boolean = url.includes("cetaitmieuxavant");

const pageTitle = computed<string>(() => findPage(route.path)?.title || "");

const watermark = computed<string | undefined>(() =>
  isPreProd ? "preprod" : isCetaitMieuxAvant ? "ctma" : undefined,
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
    margin-inline-start: 0;

    .page-title {
      display: none;
      @media only screen and (max-width: $mobile-max-width) {
        display: block;
        font-size: 1.15rem;
        font-weight: 500;
      }
    }

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

.desktop-only {
  display: block;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}

.mobile-only {
  display: none;
  @media only screen and (max-width: $mobile-max-width) {
    display: block;
  }
}
</style>
