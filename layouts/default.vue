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
          <v-img
              :src="logo"
              alt="overbookd"
              class="logo"
          ></v-img>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          v-if="hasRole(item.roles)"
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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app :style="isJauneActive ? jauneStyle : ''">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title></v-app-bar-title>
      <v-app-bar-nav-icon>
        <v-btn icon @click="toggleTheme">🌙</v-btn>
      </v-app-bar-nav-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title @click="clickOnTitle()" v-text="title" />

      <v-toolbar-title style="color: red; margin-left: 4px; font-weight: bold" v-text="version" />
      <v-spacer />
      <v-btn text @click="isDialogOpen = true">
        🐞 Signaler un bug
      </v-btn>
      <v-btn text @click="logout()">
        DECONNEXION
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>fait avec ❤️ par {{getRandomAuthor()}}</span>
    </v-footer>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card>
        <v-card-title>Report un bug 🐞 (work in progess 🔨)</v-card-title>
        <v-card-subtitle>ou de nouvelle features</v-card-subtitle>
        <v-card-text>
          <v-switch label="nouvelle feature request ?" v-model="newRequest.isFeatureRequest"></v-switch>
          <v-select :items="['hard', 'soft', 'bureau']" label="scope" v-model="newRequest.scope"></v-select>
          <v-select :items="priorities" label="priorite" v-model="newRequest.priority"></v-select>
          <v-text-field label="URL" v-model="newRequest.url"></v-text-field>
          <v-textarea label="desciption" v-model="newRequest.description"></v-textarea>
          <v-textarea label="etape pour reproduire le bug" v-if="!newRequest.isFeatureRequest" v-model="newRequest.reproduce"></v-textarea>
          <v-file-input label="capture d'ecran" v-model="newRequest.image"></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn text right @click="submitIssue()">submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" timeout="5000">Ca marche pas encore ce truc</v-snackbar>
  </v-app>
</template>

<script>

const AUTHORS = [
    'Hamza - Cookie 🍪',
    'Tit - Goelise 🦀',
    'Tibo - Bigouu 🍊',
    'Christophe - Stoph 🍺'
  ]

export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      isWhiteMode : true, // let this set to true
      counter: 0,
      isJauneActive: false,
      jauneStyle: 'background-color: #FFD13C; color: #003C71',
      isDialogOpen: false,
      version: 'ALPHA 0.8',
      priorities: ["toute l'appli est cassé 🤯", "une fontionnalite ne marche pas 🥺", "un bug chiant mais contournable 😠", "cosmetique 🤮", "jsp 🤡"],
      isSnackbarOpen: false,
      AUTHORS,
      newRequest: {
        priority: undefined,
        url: undefined,
        description: undefined,
        isFeatureRequest: false,
        reproduce: undefined,
        image: undefined,
      },
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome 🤙',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Fiche Anim 🥳',
          roles: 'hard',
          to: '/fa',
        },
        {
          icon: 'mdi-format-color-highlight',
          title: 'Fiche tache 😱',
          roles: 'hard',
          to: '/ft',
        },
        {
          icon: 'mdi-clock',
          title: 'Mes Dispo 🤯',
          to: '/availabilities',
        },
        {
          icon: 'mdi-calendar',
          title: 'Mon calendrier 📆',
          to: '/calendar',
        },
        {
          icon: 'mdi-account',
          title: 'les humains 👩‍👦‍👦',
          roles: 'hard',
          to: '/humans',
        },
        {
          icon: 'mdi-bus-articulated-front',
          title: 'Inventaire 📦',
          roles: 'hard',
          to: '/inventory',
        },
        {
          icon: 'mdi-truck',
          title: 'Logistique 🚚',
          roles: 'log',
          to: '/logistics',
        },
        {
          icon: 'mdi-human-greeting',
          title: 'Affectation 💃',
          roles: 'hard',
          to: '/assignment',
        },
        {
          icon: 'mdi-chart-areaspline-variant',
          title: 'Stats 📈',
          roles: 'hard',
          to: '/stats',
        },
        {
          icon: 'mdi-cog',
          roles: 'admin',
          title: 'Admin ⚙️',
          to: '/config',
        },
        {
          icon: 'mdi-note',
          title: 'Patch notes 📝',
          to: '/patch_note',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Overbookd',
    }
  },

  mounted() {
    this.$vuetify.theme.dark = localStorage['theme'] || false;
  },

  methods: {
    getUser(){
      return this.$store.state.user.data
    },

    getRandomAuthor(){
      const items = this.AUTHORS;
      return items[Math.floor(Math.random()*items.length)];
    },

    hasRole(role){
      if(role === undefined){
        return true
      }
      const teams = this.getUser()?.team;
      if (teams === undefined){
        return false
      }
      return teams.includes(role);
    },

    toggleTheme(){
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage['theme'] = this.$vuetify.theme.dark;
    },

    async clickOnTitle(){
      this.counter++;
      if(this.counter > 10){
        this.isJauneActive = true;
        this.title = 'RICARD - Pastis'
        const audio = new Audio('jaune.m4a');
        await audio.play()
      }
    },

    async logout(){
      await this.$auth.logout();
      await this.$router.push({
        path: '/login',
      })
    },

    async submitIssue(){
      this.newRequest.priority = "P" + this.newRequest.priority.indexOf(this.newRequest.priority);
      this.isDialogOpen = false;
      this.isSnackbarOpen = true;
    }
  },

  computed: {
    logo() {
      if(this.isJauneActive){
        return 'Ricard.png'
      }
      return this.$vuetify.theme.dark ? 'overbookd_logo_blanc.png' : 'overbookd_logo_noir.png'
    }
  }
}
</script>
