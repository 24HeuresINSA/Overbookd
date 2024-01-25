<template>
  <div class="home">
    <AlertListing />

    <h1 class="welcome" :class="{ mirror }">{{ welcomeMessage }}</h1>

    <nav>
      <v-text-field
        v-model="search"
        class="search"
        outlined
        append-icon="mdi-magnify"
        placeholder="Qu'est ce que tu cherches ?"
      ></v-text-field>

      <div class="pages">
        <nuxt-link v-for="page in pages" :key="page.title" :to="page.to">
          <v-card class="page">
            <h2>
              <v-icon>{{ page.icon }}</v-icon>
              <span>{{ page.title }}</span>
            </h2>
            <p class="description">{{ page.description }}</p>
          </v-card>
        </nuxt-link>
      </div>
    </nav>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { SlugifyService } from "@overbookd/slugify";
import { MyUserInformation } from "@overbookd/user";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import AlertListing from "~/components/molecules/alerts/AlertListing.vue";
import { pages, Page } from "~/utils/pages/pages-list";
import { isDesktop } from "~/utils/device/device.utils";

export default Vue.extend({
  name: "Home",
  components: {
    SnackNotificationContainer,
    AlertListing,
  },
  data: () => ({
    search: "",
  }),
  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    displayedName(): string {
      return this.me.nickname ? this.me.nickname : this.me.firstname;
    },
    mirrorMessage(): string {
      return `Bonjour ${this.displayedName} 🪞`;
    },
    mirror(): boolean {
      return this.welcomeMessage === this.mirrorMessage;
    },
    welcomeMessage(): string {
      const defaultMessage = `Bienvenue ${this.displayedName} 👋`;

      const possibleMessages = [
        defaultMessage,
        `BONNNSOIIIIIIIR ${this.displayedName} !!! 🔊`,
        `Wassup ${this.displayedName} 👊`,
        `你好 ${this.displayedName} 🥟`,
        `Howdy ${this.displayedName} 🤠`,
        `Salut ${this.displayedName} 👋`,
        `Je s'appelle ${this.displayedName} 🌲`,
        `ボンジュール ${this.displayedName} 🥖`,
        `Hello ${this.displayedName} 👋`,
        `Bienvenue sur Overbookd ${this.displayedName} 👋`,
        `Mes plus sincères salutations ${this.displayedName} 🥸`,
        `Guten Abend ${this.displayedName} 🥨`,
        `おはよう ${this.displayedName} 🍜`,
        this.mirrorMessage,
      ];

      const randomIndex = Math.floor(Math.random() * possibleMessages.length);
      return possibleMessages.at(randomIndex) ?? defaultMessage;
    },
    isDesktop(): boolean {
      return isDesktop();
    },
    pages(): Page[] {
      const searches = this.search
        .split(" ")
        .map((search) => SlugifyService.apply(search));

      return pages.filter(({ keywords, permission, mobileSupport }) => {
        const isSupportedByDevice = this.isDesktop || mobileSupport;
        const hasAccess = this.$accessor.user.can(permission);
        const matchSearch = keywords.some((keyword) =>
          searches.some((search) => keyword.includes(search)),
        );

        return isSupportedByDevice && hasAccess && matchSearch;
      });
    },
  },
  watch: {
    search() {
      // EASTER EGG: flip the content when user write "bde" in the search bar
      const search = this.search.toLowerCase();
      switch (search) {
        case "bde":
          this.$nuxt.$emit("flip");
          break;
        case "ebd":
          this.$nuxt.$emit("unflip");
          break;
      }
      // END EASTER EGG
    },
  },
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 30px;
  gap: 60px;
  @media only screen and (max-width: $mobile-max-width) {
    margin: 0;
    margin-top: 5px;
    gap: 40px;
  }

  .welcome {
    font-size: 4rem;
    text-align: center;
    @media only screen and (max-width: $mobile-max-width) {
      font-size: xx-large;
    }
    &.mirror {
      transform: scale(-1, 1);
    }
  }

  nav {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media only screen and (min-width: $mobile-max-width) {
      padding: 10px;
      gap: 40px;
      overflow: hidden;
    }
  }

  .search {
    width: 80%;
    @media only screen and (max-width: $mobile-max-width) {
      min-width: 95%;
    }
  }

  .pages {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    justify-items: center;
    gap: 20px;
    width: 90%;
    max-width: 90%;
    overflow-y: scroll;
    padding: 10px;
    border: solid;
    border-radius: 5px;
    border-color: lightgrey;
    border-width: thin;
    min-height: 165px;
    max-height: 355px;
    flex-wrap: wrap;
    @media only screen and (max-width: $mobile-max-width) {
      display: flex;
      gap: 20px;
      width: 100%;
      max-width: 100%;
      flex-direction: column;
      overflow: auto;
      border: none;
      padding: 2px;
      height: auto;
      max-height: unset;
    }

    a {
      text-decoration: none;
    }

    .page {
      padding: 5px;
      @media only screen and (min-width: $mobile-max-width) {
        min-width: 250px;
        max-width: 250px;
        min-height: 155px;
      }
      h2 {
        text-decoration: unset;
        font-size: large;
        display: flex;
        align-items: baseline;
        gap: 5px;
      }
      @media only screen and (max-width: $mobile-max-width) {
        h2 {
          font-size: 1.2rem;
        }
      }
      p {
        text-decoration: unset;
        margin-top: 5px;
        padding: 0px 10px;
      }
    }
  }
}
</style>
