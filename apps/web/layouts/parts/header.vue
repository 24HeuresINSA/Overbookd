<template>
  <header>
    <nuxt-link class="application" to="/">
      <img class="logo" src="/img/logo/overbookd_logo_noir.png" />
      <span class="version"> {{ version }}</span>
    </nuxt-link>
    <span class="watermark">{{ watermark }}</span>
    <div class="actions">
      <span class="action profile">
        <ProfilePicture small class="profile-picture" :user="me" />
        <span class="action__text">{{ myName }}</span>
      </span>
      <span class="action logout" @click="logout()">
        <v-icon>mdi-logout</v-icon>
        <span class="action__text"> Deconnexion </span>
      </span>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import { UserPersonnalData } from "@overbookd/user";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";

const version = process.env.OVERBOOKD_VERSION;

export default Vue.extend({
  name: "LayoutHeader",
  components: {
    ProfilePicture,
  },
  computed: {
    me(): UserPersonnalData {
      return this.$accessor.user.me;
    },
    myName(): string {
      return this.me.nickname || this.me.firstname;
    },
    version(): string {
      return `v${version}` ?? "";
    },
    isPreProd(): boolean {
      return process.env.BASE_URL?.includes("preprod") ?? false;
    },
    isCetaitMieuxAvant(): boolean {
      return process.env.BASE_URL?.includes("cetaitmieuxavant") ?? false;
    },
    watermark(): string {
      if (this.isPreProd) return "preprod";
      if (this.isCetaitMieuxAvant) return "ctma";
      return "";
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      await this.$router.push({
        path: "/login",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
header {
  z-index: 3;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 5px;
  background-color: change-color($color: $blue-24h, $whiteness: 60%);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  height: $header-height;
  @media only screen and (max-width: $mobile-max-width) {
    height: $mobile-header-height;
  }

  a {
    text-decoration: none;
    color: black;
  }
  .application {
    display: flex;
    gap: 3px;
    align-items: center;

    .logo {
      max-width: 200px;
    }

    .version {
      font-weight: 600;
      @media only screen and (max-width: $mobile-max-width) {
        display: none;
      }
    }
  }

  .actions {
    display: flex;
    .action {
      display: flex;
      gap: 2px;
      align-items: center;
      padding: 5px 10px;
      border-radius: 20%;
      &:hover {
        cursor: pointer;
        background-color: $blue-24h;
      }
      &__text {
        text-transform: capitalize;
        @media only screen and (max-width: $mobile-max-width) {
          display: none;
        }
      }
    }

    .logout {
      @media only screen and (max-width: $mobile-max-width) {
        .v-icon {
          font-size: 36px;
        }
      }
    }
  }

  .profile-picture {
    border-radius: 50%;
    max-width: 55px;
    max-height: 55px;
    @media only screen and (max-width: $mobile-max-width) {
      max-width: 45px;
      max-height: 45px;
    }
  }
}
</style>
