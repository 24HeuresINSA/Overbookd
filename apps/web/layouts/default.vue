<template>
  <v-app class="overbookd">
    <Header />
    <div class="main">
      <SideNav />
      <nuxt class="content" />
    </div>
    <footer>
      <span>Fait avec ❤️ par {{ randomAuthor }}</span>
    </footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "./parts/header.vue";
import SideNav from "./parts/side-nav.vue";

const AUTHORS = [
  "Hamza - Cookie 🍪",
  "Tit - Goelise 🦀",
  "Tibo - Bigouu 🍊",
  "Christophe - piStoph 🍺",
  "Hugo - Cashless 💰",
  "Tom - Nimbus 🧹",
  "Paul - Nuts 💥",
  "Thomas - Ginny 💡",
  "Thibaut - Moule 🍑",
  "Antoine - Gyneco 🩺",
  "Damien - Hublot 🖐",
  "Léo - Shagasse 😼",
  "Léon - Trotski 🦁",
  "Mathieu - Mussex 🐁",
  "Lucas - Conforama 🏪",
  "Adèle - Franck 🍷",
];

export default Vue.extend({
  name: "ReworkdLayout",
  components: {
    Header,
    SideNav,
  },
  computed: {
    randomAuthor(): string {
      const randomIndex = Math.floor(Math.random() * AUTHORS.length);
      return AUTHORS.at(randomIndex) ?? "";
    },
  },
});
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column-reverse;
  }
  height: 100%;
  @media only screen and (min-width: $mobile-max-width) {
    padding-bottom: 30px;
  }
  .content {
    margin-left: 35px;
    padding: 5px;
    width: 100%;
    @media only screen and (max-width: $mobile-max-width) {
      padding-bottom: 60px;
      margin: unset;
    }
  }
}

footer {
  background-color: $yellow-24h;
  padding: 5px 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
