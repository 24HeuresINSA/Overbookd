<template>
  <footer>
    <span>Fait avec ❤️ par {{ randomAuthor }}</span>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const AUTHORS = [
  "Hamza - Cookie 🍪",
  "Tit - Goelise 🦀",
  "Tibo - Bigouu 🍊",
  "Christophe - piStoph 🍺",
  "Hugo - Cashless 💰",
  "Tom - Nimbus 🧹",
  "Paul - Nuts 💥",
  "Thomas - Ginny 💡",
  "Thibaut - Moule 🦪",
  "Antoine - Gyneco 🩺",
  "Damien - Hublot 🖐",
  "Léo - Shagasse 😼",
  "Léon - Moto 🏍️",
  "Mathieu - Mussex 🐁",
  "Lucas - Conforama 🏪",
  "Adèle - Franck 🍷",
  "Luc - Q 🍑",
  "Tristan - XL 🛵",
];

const randomAuthor = computed(() => {
  const randomIndex = Math.floor(Math.random() * AUTHORS.length);
  return AUTHORS.at(randomIndex) ?? "";
});
</script>

<style lang="scss" scoped>
$background-color: change-color(
  $color: $yellow-24h,
  $whiteness: 30%,
);

footer {
  background-color: $background-color;
  padding: 5px 10px;
  width: 100%;
  z-index: 6;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
