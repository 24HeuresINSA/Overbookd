<template>
  <v-app class="overbookd">
    <Header />
    <div class="side-with-main">
      <SideNav />
      <div class="main">
        <nuxt class="content" :class="{ flip: isContentFlipped }" />
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
import { ADHERENT_REGISTERED } from "@overbookd/registration";
import { addEventListener } from "@overbookd/domain-events";

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

interface LayoutData {
  notificationSource?: EventSource;
  isContentFlipped: boolean;
}

export default Vue.extend({
  name: "ReworkdLayout",
  components: {
    Header,
    SideNav,
  },
  data: (): LayoutData => ({
    notificationSource: undefined,
    isContentFlipped: false,
  }),
  computed: {
    randomAuthor(): string {
      const randomIndex = Math.floor(Math.random() * AUTHORS.length);
      return AUTHORS.at(randomIndex) ?? "";
    },
    liveNotificationEndpoint(): string {
      const path = `${process.env.BASE_URL}/notifications/live`;
      const liveEndpoint = new URL(path);
      const token = this.$auth.strategy.token.get()?.split(" ")?.[1] ?? "";
      liveEndpoint.searchParams.append("token", token);
      return liveEndpoint.href;
    },
  },
  mounted() {
    this.notificationSource = new EventSource(this.liveNotificationEndpoint);
    addEventListener(this.notificationSource, ADHERENT_REGISTERED, () => {
      this.$accessor.notification.received();
    });

    // EASTER EGG: flip the content when user write "bde" in the search bar
    this.isContentFlipped = localStorage.getItem("flip") === "true";
    this.$nuxt.$on("flip", () => this.flipContent());
  },
  destroyed() {
    this.notificationSource?.close();
  },
  methods: {
    flipContent() {
      this.isContentFlipped = !this.isContentFlipped;
      localStorage.setItem("flip", this.isContentFlipped.toString());
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
        padding: 0 5px 5px 5px;
      }
    }

    .flip {
      transform: rotate(180deg);
    }
  }
}

footer {
  background-color: change-color($color: $yellow-24h, $whiteness: 30%);
  padding: 5px 10px;
  width: 100%;
  z-index: 6;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
