<template>
  <v-app class="overbookd">
    <Header />
    <div class="side-with-main">
      <SideNav />
      <div class="main">
        <nuxt class="content" />
        <footer>
          <span>Fait avec ❤️ par {{ randomAuthor }}</span>
        </footer>
      </div>
    </div>
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
.side-with-main {
  display: flex;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
  min-height: calc(100% - #{$header-height});
  .main {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-left: 35px;
    width: 100%;
    @media only screen and (max-width: $mobile-max-width) {
      padding-bottom: 60px;
      margin: unset;
    }
    .content {
      padding: 10px;
      @media only screen and (max-width: $mobile-max-width) {
        padding: 5px;
      }
    }
  }
}

footer {
  background-color: change-color($color: $yellow-24h, $whiteness: 30%);
  padding: 5px 10px;
  width: 100%;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
