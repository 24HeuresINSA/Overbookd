<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      :style="isJauneActive ? jauneStyle : ''"
    >
      <v-list>
        <v-list-item>
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
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      :style="isJauneActive ? jauneStyle : ''"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title></v-app-bar-title>
      <v-app-bar-nav-icon>
        <v-btn icon @click="toggleTheme">🌙</v-btn>
      </v-app-bar-nav-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-toolbar-title @click="clickOnTitle()" v-text="title" />

      <v-toolbar-title
        style="color: red; margin-left: 4px; font-weight: bold"
        v-text="version"
      />
      <v-spacer />
      <v-btn text @click="isDialogOpen = true"> 🐞 Signaler un bug </v-btn>
      <v-btn text @click="logout()">DÉCONNEXION</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :fixed="true" app>
      <span>fait avec ❤️ par {{ getRandomAuthor() }}</span>
    </v-footer>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card>
        <v-img
          src="img/memes/comsi_working.png"
          width="300px"
          style="left: 250px"
        ></v-img>
        <v-card-title>Signaler un bug ou feature request</v-card-title>
        <v-card-text>
          <h4>
            Pour signaler un bug veuiller envoyer un mail à
            incoming+24-heures-insa-overbookd-frontend-24512226-issue-@incoming.gitlab.com
            de preference en anglais
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn
            href="mailto:incoming%2B24-heures-insa-overbookd-frontend-24512226-issue-%40incoming.gitlab.com?subject=REPLACE%20WITH%20TITLE&body=%23%20URL%20or%20page%0A%3C%21---example%3A%20%2Ffa%20or%20dashboard-humain---%3E%0A%0A%23%20Expected%20behavior%0A%3C%21---What%20did%20you%20expected---%3E%0A%0A%0A%23%20Actual%20behavior%0A%3C%21---What%20is%20happening---%3E%0A%0A%23%20Steps%20to%20reproduce%0A%0A%20-%20Step%201%0A%20-%20Step%202%0A%20...%0A%0A%2Flabel%20~bug"
          >
            envoyer le mail
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" timeout="5000"
      >Ca marche pas encore ce truc</v-snackbar
    >
  </v-app>
</template>

<script>
const { version } = require("../package.json");
const { getUser, getConfig } = require("../common/role");
const AUTHORS = [
  "Hamza - Cookie 🍪",
  "Tit - Goelise 🦀",
  "Tibo - Bigouu 🍊",
  "Christophe - piStoph 🍺",
  "Hugo - Cashless 💰",
  "Tom - Nimbus 🧹",
  "Paul - Craker 💥",
  "Thomas - Ginny 💡",
];

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      isWhiteMode: true, // let this set to true
      counter: 0,
      isJauneActive: false,
      jauneStyle: "background-color: #FFD13C; color: #003C71",
      isDialogOpen: false,
      version,
      priorities: [
        "toute l'appli est cassé 🤯",
        "une fontionnalite ne marche pas 🥺",
        "un bug chiant mais contournable 😠",
        "cosmetique 🤮",
        "jsp 🤡",
      ],
      isSnackbarOpen: false,
      AUTHORS,
      file: undefined,
      newRequest: {
        title: undefined,
        priority: undefined,
        url: undefined,
        description: undefined,
        isFeatureRequest: false,
        scope: [],
        tags: [],
        image: undefined,
        author: getUser(this).lastname,
        repo: "24-heures-insa/issue-web-service",
        git_platform: "gitlab",
        steps: [],
      },
      stepDetail: undefined,
      items: [
        {
          icon: "mdi-apps",
          title: "Accueil 🤙",
          to: "/",
        },
        {
          icon: "mdi-chart-bubble",
          title: "Fiches Animation 🥳",
          roles: getConfig(this, "fa_required_role"),
          to: "/fa",
        },
        {
          icon: "mdi-format-color-highlight",
          title: "Fiches Tâches  😱",
          roles: getConfig(this, "ft_required_role"),
          to: "/ft",
        },
        {
          icon: "mdi-clock",
          title: "Mes dispos 🤯",
          to: "/availabilities",
        },
        {
          icon: "mdi-calendar",
          title: "Mon calendrier 📆",
          to: "/calendar",
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
    logo() {
      if (this.isJauneActive) {
        return "Ricard.png";
      }
      return this.$vuetify.theme.dark
        ? "overbookd_logo_blanc.png"
        : "overbookd_logo_noir.png";
    },
  },

  mounted() {
    this.$vuetify.theme.dark = localStorage["theme"] || false;
  },

  methods: {
    getUser() {
      return this.$store.state.user.me;
    },

    getRandomAuthor() {
      const items = this.AUTHORS;
      return items[Math.floor(Math.random() * items.length)];
    },

    addStep() {
      this.newRequest.steps.push(
        `${this.newRequest.steps.length + 1} - ${this.stepDetail}`
      );
      this.stepDetail = "";
    },

    hasRole(role) {
      if (role === undefined) {
        return true;
      }
      const teams = this.getUser()?.team;
      if (teams === undefined) {
        return false;
      }
      return teams.includes(role);
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

    async submitIssue() {
      let form = new FormData();
      this.newRequest.url = window.location.href;
      this.newRequest.priority =
        "P" + this.newRequest.priority.indexOf(this.newRequest.priority);
      this.newRequest.author = getUser(this).username
        ? getUser(this).username
        : getUser(this).lastname;
      this.newRequest.tags = [this.newRequest.priority];
      // this.newRequest.repo = '24-heures-insa/overbookd/frontend'

      this.newRequest.description += `
      # Date
      ${new Date().toLocaleString()}

      # Version
      ${this.version}

      # Additional Info
      User Agent: ${navigator.userAgent}
      Platform: ${navigator.platform}
      Vendor: ${navigator.vendor}
      `;

      form.append("file", this.file);
      form.append("json", this.newRequest);

      await this.$axios.post("/issue", form);

      this.isDialogOpen = false;
      this.isSnackbarOpen = true;
    },
  },
};
</script>
