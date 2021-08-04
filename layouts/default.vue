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
              src="overbookd_logo_blanc.png"
              alt="overbookd logo"
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
      <v-spacer />
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
      this.$vuetify.theme.dark = this.isWhiteMode;
      this.isWhiteMode = !this.isWhiteMode;
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
  }
}
</script>
