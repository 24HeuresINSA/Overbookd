<template>
  <div>
    <v-form>
      <v-container class="form-container">
        <v-row>
          <v-img
            :src="overbookd_logo"
            alt="overbookd logo"
            class="logo"
          ></v-img>
        </v-row>
        <v-row>
          <h2 style="right: -40%; position: relative; color: red">ALPHA</h2>
        </v-row>
        <v-row>
        </v-row>
        <v-img src="/home_meme.jpg"></v-img>
        <v-row>
          <h2>Patch note 0.7</h2>
        </v-row>
        <v-row>
          <h3>les fix apres les retours de Stoph et Tit, Début de la LOG (marche pas encore)️</h3>
          <ul>
            <li>🚚 interface de la log pour user.log (selectionner un outil demande en FT puis valider les FT)</li>
            <li>🗑 delete les FT (mercu stoph)</li>
            <li>👀 les icons sont un peu plus propre</li>
            <li>🗑 supp du code inutile (ca charge 0.002s plus rapidement)</li>
            <li>📝 un remercimenet au auteure </li>
            <li>🤯 fix buf des date de naissance qui s'affiche pas </li>
            <li>🤪 les humains ne peuvent plus se donner le role admin ou bureau</li>
            <li>📝 corrige un bug causant les FA a ne pas se sauvgarder (merci stoph ❤️)</li>
            <li>⏰ on ne peut mettre que des multiple de 15 en minute (fix du format 24h )</li>

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
        const audio = new Audio('jaune.m4a');
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
  margin-bottom: 10%;
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
