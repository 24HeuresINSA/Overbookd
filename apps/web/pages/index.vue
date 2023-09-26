<template>
  <div class="home">
    <v-alert
      v-for="alert in alerts"
      :key="alert.message"
      color="error"
      dark
      icon="mdi-nuke"
      border="left"
      prominent
      dismissible
      @input="dismiss(alert)"
    >
      <h2 class="alert">{{ alert.message }}</h2>
      <p class="description">{{ alert.description }}</p>
    </v-alert>

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
import { SlugifyService } from "@overbookd/slugify";
import { MyUserInformation } from "@overbookd/user";
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { pages, Page } from "~/utils/pages/pages-list";
import { isDesktop } from "~/utils/device/device.utils";
import { Alert } from "../../../domains/personnal-account/src/in-debt-alerting";

export default Vue.extend({
  name: "Home",
  components: {
    SnackNotificationContainer,
  },
  data: () => ({
    search: "",
  }),
  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
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
    alerts(): Alert[] {
      return this.$accessor.alert.alerts;
    },
  },
  methods: {
    dismiss(alert: Alert) {
      this.$accessor.alert.dismiss(alert);
    },
  },
});
</script>

<style lang="scss" scoped>
.description {
  padding-right: 30px;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
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

  .alert {
    @media only screen and (max-width: $mobile-max-width) {
      font-size: large;
    }
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
    display: flex;
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
