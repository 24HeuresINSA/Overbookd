<template>
  <header>
    <Logo />
    <span class="watermark">{{ watermark }}</span>
    <div class="actions">
      <nuxt-link class="action profile" to="/profile">
        <ProfilePicture small class="profile-picture" :user="me" />
        <span class="action__text">{{ myName }}</span>
      </nuxt-link>
      <span class="action logout" @click="logout">
        <v-icon>mdi-logout</v-icon>
        <span class="action__text"> Deconnexion </span>
      </span>
    </div>
  </header>
</template>

<script lang="ts" setup>
import Logo from "./logo.vue";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const isPreProd = computed(
  () => process.env.BASE_URL?.includes("preprod") ?? false,
);
const isCetaitMieuxAvant = computed(
  () => process.env.BASE_URL?.includes("cetaitmieuxavant") ?? false,
);

const { me } = storeToRefs(userStore);
const myName = computed(() => me.value.nickname || me.value.firstname);

const watermark = computed(() => {
  if (isPreProd.value) return "preprod";
  if (isCetaitMieuxAvant.value) return "ctma";
  return "";
});

const logout = async () => {
  authStore.logout();
  await router.push({ path: "/login" });
  userStore.clearLoggedUser();
};
</script>

<style lang="scss" scoped>
$background-color: change-color(
  $color: $yellow-24h,
  $whiteness: 30%,
);

header {
  z-index: 10;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 5px;
  background-color: $background-color;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  height: $header-height;
  @media only screen and (max-width: $mobile-max-width) {
    height: $mobile-header-height;
  }

  a {
    text-decoration: none;
    color: black;
  }

  .actions {
    display: flex;
    .action {
      display: flex;
      gap: 2px;
      align-items: center;
      padding: 5px 10px;
      &:hover {
        cursor: pointer;
        background-color: change-color(
          $color: $background-color,
          $whiteness: 60%
        );
      }
      &__text {
        text-transform: capitalize;
        @media only screen and (max-width: $mobile-max-width) {
          display: none;
        }
      }
      &.profile {
        gap: 5px;
      }
      .bell {
        .bullet {
          display: none;
          &.active {
            display: inline-block;

            border-radius: 50%;
            background-color: $blue-24h;
            position: relative;
            z-index: 4;
            @media only screen and (max-width: $mobile-max-width) {
              left: 40px;
              bottom: 10px;
              min-width: 15px;
              min-height: 15px;
            }
            left: 28px;
            bottom: 7px;
            min-width: 10px;
            min-height: 10px;
          }
        }
      }
    }

    .logout,
    .bell {
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
    padding: unset;
  }

  .watermark {
    text-transform: uppercase;

    color: #ec0000;
    font-size: 50px;
    font-weight: 500px;
    opacity: 1;
    animation: wiggle 2s infinite;
  }

  @keyframes wiggle {
    0% {
      transform: rotate(0deg);
    }
    80% {
      transform: rotate(0deg);
    }
    85% {
      transform: rotate(5deg);
    }
    95% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
}
</style>
