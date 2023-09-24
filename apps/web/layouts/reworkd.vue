<template>
  <v-app class="overbookd">
    <Header />
    <div class="main">
      <aside>
        <nav>
          <nuxt-link
            v-for="page in pages"
            :key="page.title"
            :to="page.to"
            class="page"
          >
            <v-icon>{{ page.icon }}</v-icon>
            <span class="page__title">{{ page.title }}</span>
          </nuxt-link>
        </nav>
        <div class="actions">
          <span class="action bug-report">
            <v-icon>mdi-bug</v-icon>
            <span class="action__title">Rapporter une erreur</span>
          </span>
          <span class="action ask-help">
            <v-icon>mdi-help-circle-outline</v-icon>
            <span class="action__title">Une question ?</span>
          </span>
        </div>
      </aside>

      <nuxt class="content" />
    </div>
    <footer>
      <span>Fait avec ❤️ par {{ randomAuthor }}</span>
    </footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { isDesktop } from "~/utils/device/device.utils";
import { Page, pages } from "~/utils/pages/pages-list";
import Header from "./parts/header.vue";

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
  },
  computed: {
    randomAuthor(): string {
      const randomIndex = Math.floor(Math.random() * AUTHORS.length);
      return AUTHORS.at(randomIndex) ?? "";
    },
    pages(): Page[] {
      return pages.filter(({ permission, mobileSupport }) => {
        const isSupportedByDevice = isDesktop() || mobileSupport;
        const hasAccess = this.$accessor.user.can(permission);

        return isSupportedByDevice && hasAccess;
      });
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
  aside {
    position: sticky;
    @media only screen and (max-width: $mobile-max-width) {
      position: fixed;
      z-index: 3;
      width: 100%;
      .actions {
        border-left: 2px solid #756a46;
        display: flex;
      }
      .v-icon {
        font-size: 36px;
      }
    }
    bottom: 0;
    @media only screen and (max-width: $mobile-max-width) {
      flex-direction: row;
    }
    background-color: change-color($color: $yellow-24h, $whiteness: 60%);
    min-width: 35px;
    padding: 5px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &:hover {
      min-width: 200px;
      .page__title,
      .action__title {
        display: unset;
      }
    }

    .action,
    .page {
      padding: 5px;
      &:hover {
        cursor: pointer;
        background-color: $yellow-24h;
      }
      display: flex;
      gap: 3px;
      &__title {
        display: none;
      }
    }

    nav {
      a {
        text-decoration: none;
        color: black;
      }
      display: flex;
      flex-direction: column;
      @media only screen and (max-width: $mobile-max-width) {
        flex-direction: row;
        max-width: 80%;
        overflow-x: scroll;
        overflow-y: hidden;
      }
    }
  }
  .content {
    padding: 5px;
    width: 100%;
    @media only screen and (max-width: $mobile-max-width) {
      padding-bottom: 60px;
    }
  }
}

footer {
  background-color: change-color($color: $blue-24h, $whiteness: 60%);
  padding: 5px 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
