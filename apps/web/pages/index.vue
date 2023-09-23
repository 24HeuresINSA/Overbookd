<template>
  <div class="home">
    <h1 class="welcome">Bienvenue sur Overbookd 👋</h1>

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
import { Permission } from "@overbookd/permission";
import { SlugifyService } from "@overbookd/slugify";
import { MyUserInformation } from "@overbookd/user";
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { pages, Page } from "~/utils/pages/pages-list";

export default Vue.extend({
  name: "Home",
  components: {
    SnackNotificationContainer,
  },
  data: () => {
    return {
      search: "",
    };
  },
  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    pages(): Page[] {
      const searches = this.search
        .split(" ")
        .map((search) => SlugifyService.apply(search));
      return pages.filter(
        ({ keywords, permission }) =>
          this.can(permission) &&
          keywords.some((keyword) =>
            searches.some((search) => keyword.includes(search)),
          ),
      );
    },
  },
  methods: {
    can(permission?: Permission): boolean {
      if (!permission) return true;
      return this.me.permissions.includes(permission);
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
    margin: 0px;
    gap: 40px;
  }

  .welcome {
    font-size: 4rem;
    @media only screen and (max-width: $mobile-max-width) {
      font-size: xx-large;
      text-align: center;
    }
  }

  nav {
    width: 100%;
    @media only screen and (min-width: $mobile-max-width) {
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
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
    display: flex;
    gap: 20px;
    width: 90%;
    max-width: 90%;
    overflow-x: scroll;
    padding: 10px;
    border: solid;
    border-radius: 5px;
    border-color: lightgrey;
    border-width: thin;
    min-height: 165px;
    @media only screen and (max-width: $mobile-max-width) {
      width: 100%;
      max-width: 100%;
      flex-direction: column;
      overflow: auto;
      border: none;
      padding: 2px;
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
