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
        <v-list-item>
          <v-list-item-action @click="miniVariant = !miniVariant">
            <v-icon v-if="miniVariant">mdi-chevron-double-right</v-icon>
            <v-icon v-else>mdi-chevron-double-left</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-btn icon to="/">
              <v-img
                :src="'/img/logo/' + logo"
                alt="overbookd"
                aspect-ratio="1"
                contain
              ></v-img>
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <template v-for="(item, i) in pages">
          <v-list-item
            v-if="hasPermission(item.permission)"
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
      <v-app-bar-nav-icon @click="drawer = !drawer" />
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
      <div v-if="isCetaitMieuxAvant" class="watermark">CTMA</div>
      <v-btn v-if="hasPermission('hard')" text @click="isDialogOpen = true">
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
      <span>Fait avec ❤️ par {{ getRandomAuthor() }}</span>
    </v-footer>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card v-if="hasPermission('hard')">
        <v-card-title>Signaler un bug ou feature request</v-card-title>
        <v-card-text>
          <h4>
            Pour signaler un bug veuillez envoie un mail à <br />
            <code>
              contact-project+24-heures-insa-overbookd-mono-31598236-issue-@incoming.gitlab.com
            </code>
            <br />
            en précisant le problème rencontré et en joignant une capture
            d'écran. Tu peux cliquer sur le bouton "Envoyer le mail" pour ouvrir
            ton client mail. Si rien ne se passe, tu peux utiliser les deux
            autres bontons pour copier l'adresse mail et le template. <br />
            ⚠ Utilise bien le template pour ton mail, cela nous aide vraiment
            pour notre travail. Merci🙏
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="mailUrl" color="primary"> Envoyer le mail </v-btn>
          <v-btn
            color="blue-grey"
            @click="
              copyToClipboard(
                'contact-project+24-heures-insa-overbookd-mono-31598236-issue-@incoming.gitlab.com'
              )
            "
            >Copier l'adresse mail</v-btn
          >
          <v-btn color="purple" @click="copyToClipboard(generateIssueTemplate)"
            >Copier le template</v-btn
          >
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
      pages: [
        {
          icon: "mdi-apps",
          title: "Accueil",
          to: "/",
        },
        {
          icon: "mdi-image",
          title: "Trombinoscope",
          permission: "hard",
          to: "/trombinoscope",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Fiches Activités",
          permission: "hard",
          to: "/fa",
        },
        {
          icon: "mdi-format-color-highlight",
          title: "Fiches Tâches",
          permission: "hard",
          to: "/ft",
        },
        {
          icon: "mdi-account-group",
          title: "Liste des bénévoles",
          permission: "hard",
          to: "/humans",
        },
        {
          icon: "mdi-clock",
          title: "Mes dispos",
          to: "/availabilities",
        },
        {
          icon: "mdi-calendar-clock",
          title: "Planning",
          permission: "hard",
          to: `/calendar/${this.$accessor.user.me.id}`,
        },
        {
          icon: "mdi-clock-edit",
          title: "Charisme des dispos",
          permission: "can-affect",
          to: "/charismaPeriod",
        },
        {
          icon: "mdi-human-greeting",
          title: "Affect Orga-Tâche",
          permission: "can-affect",
          to: "/assignment/orga-task",
        },
        {
          icon: "mdi-human-greeting",
          title: "Affect Tâche-Orga",
          permission: "can-affect",
          to: "/assignment/task-orga",
        },
        {
          icon: "mdi-clock",
          title: "Besoin orgas",
          permission: "can-affect",
          to: "/orga-needs",
        },
        {
          icon: "mdi-clock-fast",
          title: "Timeline",
          permission: "can-view-timeline",
          to: "/timeline",
        },
        {
          icon: "mdi-handshake",
          title: "A l'aide",
          permission: "can-ask-for-help",
          to: "/need-help",
        },
        {
          icon: "mdi-cog",
          permission: "admin",
          title: "Admin",
          to: "/config",
        },
        {
          icon: "mdi-format-list-bulleted",
          permission: "manage-cp",
          title: "SG",
          to: "/SG",
        },
        {
          icon: "mdi-cash-multiple",
          permission: "manage-cp",
          title: "Transactions",
          to: "/transactions",
        },
        {
          icon: "mdi-bookshelf",
          permission: "catalog-read",
          title: "Catalogue",
          to: "/catalog",
        },
        {
          icon: "mdi-warehouse",
          permission: "inventory-write",
          title: "Inventaire",
          to: "/inventory",
        },
        {
          icon: "mdi-truck",
          permission: "inventory-write",
          title: "Logistique",
          to: "/logistic",
        },
        {
          icon: "mdi-web-sync",
          permission: "communication-read",
          title: "Animations à publier",
          to: "/comcom",
        },
        {
          icon: "mdi-chart-areaspline-variant",
          title: "Stats",
          permission: "hard",
          to: "/stats",
        },
      ],
      //TODO: remove this when the new backend is over
      old_pages: [
        {
          icon: "mdi-calendar-export",
          title: "Export Planning",
          roles: "humain",
          to: "/exportPlanning",
        },
        {
          icon: "mdi-fire",
          roles: "hard",
          title: "OverTinder",
          to: "/overTinder",
        },
        {
          icon: "mdi-image",
          roles: "hard",
          title: "Trombinoscope",
          to: "/trombinoscope",
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Overbookd",
    };
  },

  head: () => ({
    title: "Overbookd",
  }),

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

    generateIssueTemplate() {
      return `# URL or page
${window.location.href}

# Expected behavior
<!---What did you expected--->


# Actual behavior
<!---What is happening--->

# Steps to reproduce

 - Step 1
 - Step 2
 ...

# Additional info
version: ${version}
user agent: ${navigator.userAgent}
vendor: ${navigator.vendor}
date: ${Date().toLocaleString()}
resolution: ${window.screen.availWidth}x${window.screen.availHeight}`;
    },

    mailUrl() {
      return `mailto:contact-project%2B24-heures-insa-overbookd-mono-31598236-issue-%40incoming.gitlab.com?body=${encodeURIComponent(
        this.generateIssueTemplate
      )}`;
    },
    isPreProd() {
      return process.env.BASE_URL.includes("preprod");
    },
    isCetaitMieuxAvant() {
      return process.env.BASE_URL.includes("cetaitmieuxavant");
    },
  },

  mounted() {
    let theme = localStorage["theme"];
    if (theme === "false") theme = false;
    this.$vuetify.theme.dark = theme || false;
  },

  methods: {
    getRandomAuthor() {
      const items = this.AUTHORS;
      return items[Math.floor(Math.random() * items.length)];
    },

    hasPermission(permission) {
      return this.$accessor.user.hasPermission(permission);
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage["theme"] = this.$vuetify.theme.dark;
      this.$accessor.theme.toggleDarkTheme();
    },

    async clickOnTitle() {
      this.counter++;
      if (this.counter > 24) {
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
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
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
