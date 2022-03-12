<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      fixed
      app
      :style="isJauneActive ? jauneStyle : ''"
    >
      <v-list>
        <v-list-item to="/">
          <v-img :src="'img/logo/' + logo" alt="overbookd" class="logo"></v-img>
        </v-list-item>
        <template v-for="(item, i) in items">
          <v-list-item
            v-if="hasRole(item.roles)"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar fixed app :style="isJauneActive ? jauneStyle : ''">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        v-if="!isMobile"
        class="ml-2"
        @click="clickOnTitle()"
        v-text="title"
      />

      <v-toolbar-title
        v-if="!isMobile"
        style="color: red; margin-left: 4px; font-weight: bold"
        v-text="version"
      />

      <v-spacer />
      <div v-if="isPreProd" class="watermark">PREPROD</div>
      <v-btn v-if="hasRole('hard')" text @click="isDialogOpen = true">
        <v-icon>mdi-bug-outline</v-icon>
        {{ isMobile ? "" : "Signaler un bug" }}
      </v-btn>
      <v-btn v-else text @click="isDialogOpen = true">
        <v-icon>mdi-help-box</v-icon>
        {{ isMobile ? "" : "Demander de l'aide" }}
      </v-btn>
      <v-app-bar-nav-icon>
        <v-btn icon @click="toggleTheme">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
      <v-btn icon @click="logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container style="max-width: none">
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :fixed="true" app>
      <span>fait avec ❤️ par {{ getRandomAuthor() }}</span>
    </v-footer>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card v-if="hasRole('hard')">
        <v-img
          src="img/memes/comsi_working.png"
          width="300px"
          style="left: 250px"
        ></v-img>
        <v-card-title>Signaler un bug ou feature request</v-card-title>
        <v-card-text>
          <h4>
            Pour signaler un bug veuiller envoyer un mail à
            contact-project+24-heures-insa-overbookd-mono-31598236-issue-@incoming.gitlab.com
            de preference en anglais
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="mailUrl"> envoyer le mail </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title>Demander de l'aide</v-card-title>
        <v-card-text>
          <h4>
            Si vous avez un problème ou que vous vous posez une question vous
            pouvez nous envoyer un mail à l'adresse humains@24heures.org <br />
            Nous nous en occuperons au plus vite.
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="`mailto:humains@24heures.org`"> Envoyer le mail </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" timeout="5000"
      >Ca marche pas encore ce truc
    </v-snackbar>
  </v-app>
</template>

<script>
const { version } = require("../package.json");
const { getConfig } = require("../common/role");

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
];

export default {
  middleware: "user",
  data() {
    return {
      drawer: false,
      isWhiteMode: true, // let this set to true
      counter: 0,
      isJauneActive: false,
      jauneStyle: "background-color: #FFD13C; color: #003C71",
      isDialogOpen: false,
      version,
      isSnackbarOpen: false,
      AUTHORS,
      file: undefined,
      stepDetail: undefined,
      items: [
        {
          icon: "mdi-apps",
          title: "Accueil 🤙",
          to: "/",
          roles: "hard",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Fiches Activitée 🥳",
          roles: this.getConfig("fa_required_role"),
          to: "/fa",
        },
        {
          icon: "mdi-format-color-highlight",
          title: "Fiches Tâches  😱",
          roles: this.getConfig("ft_required_role"),
          to: "/ft",
        },
        {
          icon: "mdi-calendar-clock",
          title: "Orga requis🤯",
          roles: "hard",
          to: "/planning",
        },
        {
          icon: "mdi-clock",
          title: "Mes dispos 🤯",
          roles: "everyone",
          to: "/availabilities",
        },
        {
          icon: "mdi-clock",
          title: "Créer dispos",
          roles: "humain",
          to: "/createavailibility",
        },
        {
          icon: "mdi-clock",
          title: "Modifier dispos",
          roles: "humain",
          to: "/modifyavailabilities",
        },
        {
          icon: "mdi-calendar",
          title: "Mon calendrier 📆",
          to: "/calendar",
          roles: "everyone",
        },
        {
          icon: "mdi-account",
          title: "Liste des Orgas 👩‍👦‍👦",
          roles: "hard",
          to: "/humans",
        },
        {
          icon: "mdi-bus-articulated-front",
          title: "Inventaire 📦",
          roles: "hard",
          to: "/inventory",
        },
        {
          icon: "mdi-truck",
          title: "Logistique 🚚",
          roles: "log",
          to: "/logistics",
        },
        {
          icon: "mdi-human-greeting",
          title: "Affectation 💃",
          roles: "humain",
          to: "/assignment",
        },
        {
          icon: "mdi-chart-areaspline-variant",
          title: "Stats 📈",
          roles: "hard",
          to: "/stats",
        },
        {
          icon: "mdi-cog",
          roles: "admin",
          title: "Admin ⚙️",
          to: "/config",
        },
        {
          icon: "mdi-format-list-bulleted",
          roles: "admin",
          title: "SG 📝️",
          to: "/SG",
        },
        {
          icon: "mdi-cash-multiple",
          roles: "admin",
          title: "Transactions 💰️",
          to: "/transactions",
        },
        {
          icon: "mdi-fire",
          roles: "hard",
          title: "OverTinder 🍑",
          to: "/overTinder",
        },
        {
          icon: "mdi-image",
          roles: "hard",
          title: "Trombinoscope 🎆",
          to: "/trombinoscope",
        },
        {
          icon: "mdi-note",
          title: "Patch notes 📝",
          roles: "hard",
          to: "/patch_note",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Overbookd",
    };
  },

  computed: {
    me() {
      return this.$accessor.user.me;
    },

    isMobile() {
      return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
    },
    logo() {
      if (this.isJauneActive) {
        return "Ricard.png";
      }
      return this.$vuetify.theme.dark
        ? "overbookd_logo_blanc.png"
        : "overbookd_logo_noir.png";
    },

    mailUrl() {
      return `mailto:contact-project%2B24-heures-insa-overbookd-mono-31598236-issue-%40incoming.gitlab.com?body=%23%20URL%20or%20page%0A${encodeURIComponent(
        window.location.href
      )}%0A%0A%23%20Expected%20behavior%0A%3C%21---What%20did%20you%20expected---%3E%0A%0A%0A%23%20Actual%20behavior%0A%3C%21---What%20is%20happening---%3E%0A%0A%23%20Steps%20to%20reproduce%0A%0A%20-%20Step%201%0A%20-%20Step%202%0A%20...%0A%0A%23%20Additional%20info%0Aversion%3A%20${encodeURI(
        version
      )}%0Auser%20agent%3A%20${encodeURI(
        navigator.userAgent
      )}%0Avendor%3A%20${encodeURI(
        navigator.vendor
      )}%20%0Adate%3A%20${encodeURI(
        new Date().toLocaleString()
      )}%20%0Aresolution%3A%20${encodeURI(
        window.screen.availWidth + "x" + window.screen.availHeight
      )}`;
    },
    isPreProd() {
      return process.env.BASE_URL.includes("preprod");
    },
  },

  mounted() {
    this.$vuetify.theme.dark = localStorage["theme"] || false;
  },

  methods: {
    getRandomAuthor() {
      const items = this.AUTHORS;
      return items[Math.floor(Math.random() * items.length)];
    },

    hasRole(role) {
      if (role === "everyone") {
        return true;
      }
      if (this.me.team) {
        //Permet de definir un cas de figure pour qu'une fenetre soit accessible par tout le monde
        return this.me.team.includes(role);
      }
      return false;
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage["theme"] = this.$vuetify.theme.dark;
    },

    async clickOnTitle() {
      this.counter++;
      if (this.counter > 10) {
        this.isJauneActive = true;
        this.title = "RICARD - Pastis";
        const audio = new Audio("audio/jaune.m4a");
        await audio.play();
      }
    },

    async logout() {
      await this.$auth.logout();
      await this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>

<style>
.watermark {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;

  color: #ec0000;
  font-size: 100px;
  font-weight: 500px;
  display: grid;
  justify-content: center;
  align-content: center;
  opacity: 1;
  animation: wiggle 2s infinite;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
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
</style>
