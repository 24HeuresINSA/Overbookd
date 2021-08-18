<template>
  <div>
    <v-form>
      <v-container class="form-container">
        <v-row>
          <v-img
            :src="'img/logo/' + overbookd_logo"
            alt="overbookd logo"
            class="logo"
          ></v-img>
        </v-row>
        <v-row>
          <h2 style="right: -40%; position: relative; color: red; z-index: 20">{{version}}</h2>
        </v-row>
        <v-row>
          <v-img src="img/memes/home_meme.jpg"></v-img>
        </v-row>
        <v-row>
          <h2>Patch note {{version}}</h2>
        </v-row>
        <v-row>
          <h3>🔥 hotfix d'un bug qui faisait que toute l'appli crash (Merci Tit), du coup la version 0.11 est sorti plus tot que prevu en tant que v0.10b</h3>
          <ul>
            <li>📝 ajout d'une page 404 (avec un petit meme b1sur)</li>
            <li>🥳 quand on est stoph on peut voir ca date de naissance</li>
            <li>🔨 LE CLICKER MARCHE</li>
            <li>🧹 nettoyage des fichiers static </li>
            <li>👀 petits corrections de l'interface</li>
          </ul>
          <h3>Corrections de quelques bugs signaler sur la page d'inscription et systeme de demande d'amis (Merci MAAF ❤️)</h3>
          <ul>
            <li>📝 l'appli check si tu as bien mis le meme mdp a l'inscription</li>
            <li>🤪 l'appli explique comment se co apres avoir creer un compte</li>
            <li>🔒 les champs avec un * sont obligatoirs</li>
            <li>😏 les mdp ne sont plus stocke dans la base de donnee</li>
            <li>❤️ quand qqun nous accepte en ami il se rajoute dans la liste d'ami (il faut refresh quand meme)</li>
            <li>🧹 nettoyage du code de la backend (mais personne ne peux remaque la diff)</li>
            <li>👀 preparation pour le magnifique webservice de Tit pour la prochaine MaJ</li>
          </ul>
        </v-row>
        <v-row>

        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.username"
            label="username"
            type="text"
            required
            autofocus
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.password"
            label="password"
            type="password"
            required
            @keydown.enter="login()"
          ></v-text-field>
        </v-row>
      </v-container>
      <v-btn
        color="secondary"
        elevation="2"
        href="/signup"
        class="signupBtn Btn"
        >signup</v-btn
      >
      <v-btn color="primary" elevation="2" @click="login()" class="loginBtn Btn"
        >login</v-btn
      >
    </v-form>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
const REDIRECT_URL = "/"; // TODO change this to eventSelector page
const {version} = require('../package.json')

export default {
  name: "login",
  auth: false,
  layout: 'none',

  data: () => ({
    credentials: {
      username: undefined,
      password: undefined,
    },
    snackbar: false,
    feedbackMessage: undefined,
    timeout: 5000,
    version,
  }),

  async beforeCreate() {
    if (this.$auth.loggedIn) {
      await this.$router.push({
        path: REDIRECT_URL,
      }); // redirect to homepage
    }
  },

  methods: {
    login: async function () {
      try {
        await this.$auth.loginWith("keycloak", this.credentials); // try to log user in
        await this.$router.push({
          path: REDIRECT_URL,
        }); // redirect to homepage
        const audio = new Audio('audio/jaune.m4a');
        await audio.play()
      } catch (e) {
        if (e.response.status === 401) {
          // wrong password or username
          this.feedbackMessage = "Password or username are incorrect 😞";
        } else {
          this.feedbackMessage =
            "an error has occurred, please contact the ComSI team 😴";
        }
        this.snackbar = true;
        console.log("an error has occurred");
        console.error();
      }
    },
  },

  computed: {
    overbookd_logo: function () {
      return this.$vuetify.theme.dark
        ? "overbookd_logo_blanc.png"
        : "overbookd_logo_noir.png";
    },
  },
};
</script>

<style scoped lang="scss">
.logo {
  //margin-bottom: 10%;
}
.form-container {
  align-self: center;
  justify-self: center;
  margin-top: 10%;
  width: 75%;
  max-width: 600px;
}

.Btn {
  position: absolute;
  bottom: 20px;
}

.loginBtn {
  right: 20px;
}
.signupBtn {
  left: 20px;
}
</style>
