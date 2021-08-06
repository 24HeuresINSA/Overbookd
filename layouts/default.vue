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
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card>
        <v-card-title>Report un bug 🐞</v-card-title>
        <v-card-text>
          <p>
          Comme dis, c'est une version alpha avec encore des bugs et des fonctionnalités non dispo. Pour ce faire, nous avons mis en place une structure de mail pour nous remonter les bugs, les fonctionnalités manquantes...
          Les bugs seront corriger que si on recoit un mail !
          Comment qu'on envoi un mail ?
          </p>
          <ul>
            <li>Destinataire : overbookd@24heures.org</li>
            <li>Mettre comme objet : [Overbookd][bug] titre du bug</li>
            <li>Mettre des Screenshots en PJ et uniquement en PJ</li>
            <li>Mettre comme corps du mail :</li>
          </ul>

          <br>
          <strong># Date</strong>
          2021-08-04
          <br>

          <strong># URL</strong>
          https://overbookd.24heures.org/`chemin>`
          <br>

          <strong># Description du bug</strong>
          <p>Page blanche pour éditer une FT</p>
          <br>
          <h4># étapes pour reproduire le bug</h4>

          <p>1. cliquer sur le menu des FT</p>
          <p>2. Cliquer sur le bonton d'édition d'une FT</p>
          <br>

          <ul>
            <li>Pour se connecter, on a mis en place différents rôle avec des mot de passe, c'est assez simple, le nom d'utilisateur et le meme que le mot de passe.
              Liste des user [username (rôles)] :</li>
            <li>user.bureau (bureau, hard)</li>
            <li>user.hard (hard)</li>
            <li>user.humain (hard, humain)</li>
            <li>user.log (hard, log)</li>
            <li>user.secu (hard, secu)</li>
            <li>user.soft (soft)</li>
            <li>user.admin (hard, admin)</li>
          </ul>
          <p>
            De plus, le formulaire d'inscription est ouvert. Vous pouvez faire des comptes pour vous. Bien mettre une
            adresse mail valide, y a un p'tit mail qui vous est envoyé pour confirmer votre adresse.
          </p>
          <p>
            Voila, voila, amuser vous bien ;)
            On reste dispo avec Hamza pour vos questions et retour
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
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
      version: 'ALPHA 0.2',
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
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Overbookd',
    }
  },

  methods: {
    getUser(){
      return this.$store.state.user.data
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
