<template>
  <div>
    <v-img
      :src="randomURL"
      style="
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        padding: 0;
      "
    ></v-img>
    <v-form>
      <v-container class="form-container">
        <v-row>
          <v-img src="img/memes/home_meme.jpeg"></v-img>
        </v-row>
        <v-row>
          <v-img
            src="img/logo/overbookd_logo_blanc.png"
            alt="overbookd logo"
            class="logo"
          ></v-img>
        </v-row>
        <v-row>
          <h2 style="right: -40%; position: relative; color: red; z-index: 20">
            {{ version }}
          </h2>
        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.username"
            label="email ou username"
            type="text"
            required
            autofocus
            outlined
            solo
            filled
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.password"
            label="password"
            type="password"
            required
            outlined
            clearable
            solo
            filled
            @keydown.enter="login()"
          ></v-text-field>
        </v-row>
      </v-container>
      <v-btn
        color="secondary"
        elevation="2"
        href="/signup"
        class="signupBtn Btn"
        >s'inscrire
      </v-btn>
      <v-btn color="primary" elevation="2" class="loginBtn Btn" @click="login()"
        >connexion
      </v-btn>
    </v-form>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
const REDIRECT_URL = "/";
const BACKGROUNDS_URL = [
  "https://www.24heures.org/img/background/24h_insa_2019_FEDER_2.jpg",
  "https://www.24heures.org/img/background/a-propos-histoire.jpg",
  "https://www.24heures.org/img/background/a-propos-partenaires.jpg",
  "https://www.24heures.org/img/background/animations-1.jpg",
  "https://www.24heures.org/img/background/animations-construction-back.jpg",
  "https://www.24heures.org/img/background/animations-prevention-back.jpg",
  "https://www.24heures.org/img/background/background_courses_2020.png",
  "https://www.24heures.org/img/background/concerts-comah.jpg",
  "https://www.24heures.org/img/background/courses-caritatives.jpg",
  "https://www.24heures.org/img/background/courses-constructions-back.jpg",
  "https://www.24heures.org/img/background/courses-parcours.jpg",
  "https://www.24heures.org/img/background/courses_2020.jpg",
  "https://www.24heures.org/img/background/courses_2021.jpg",
  "https://www.24heures.org/img/background/courses_resultats.jpg",
  "https://www.24heures.org/img/background/courses_resultats_2.jpg",
  "https://www.24heures.org/img/background/footer_background.jpg",
  "https://www.24heures.org/img/background/home-bellecour.jpg",
  "https://www.24heures.org/img/background/home-mome.jpg",
  "https://www.24heures.org/img/background/home-public-45.jpg",
  "https://www.24heures.org/img/background/home-spot.jpg",
  "https://www.24heures.org/img/background/infos-bars-back.jpg",
  "https://www.24heures.org/img/background/infos-bars.jpg",
  "https://www.24heures.org/img/background/infos-contact.jpg",
  "https://www.24heures.org/img/background/infos-transports-back.jpg",
  "https://www.24heures.org/img/background/infos-transports.jpg",
  "https://www.24heures.org/img/background/live-nb.jpg",
  "https://www.24heures.org/img/background/orga-equipe-paille.jpg",
  "https://www.24heures.org/img/background/orga-equipe.jpg",
  "https://www.24heures.org/img/background/pimpmybike.jpg",
  "https://www.24heures.org/img/background/prevention-1.jpg",
  "https://www.24heures.org/img/background/tremplin-fuzzcall.jpg",
  "https://www.24heures.org/img/background/webtv.jpg",
];
const { version } = require("../package.json");

export default {
  name: "Login",
  auth: false,
  layout: "none",

  data: () => ({
    credentials: {
      username: undefined,
      password: undefined,
    },
    snackbar: false,
    feedbackMessage: undefined,
    timeout: 5000,
    version,
    randomURL: undefined,
  }),

  async beforeCreate() {
    if (this.$auth.loggedIn) {
      await this.$router.push({
        path: REDIRECT_URL,
      }); // redirect to homepage
    }
  },

  mounted() {
    this.randomURL = this.getRandomBackgroundURL();
  },

  methods: {
    login: async function () {
      try {
        await this.$auth.loginWith("keycloak", this.credentials); // try to log user in
        await this.$router.push({
          path: REDIRECT_URL,
        }); // redirect to homepage
        const audio = new Audio("audio/jaune.m4a");
        await audio.play();
      } catch (e) {
        console.error(e);
        if (e.response.status === 401) {
          // wrong password or username
          this.feedbackMessage = "Password or username are incorrect 😞";
        } else {
          this.feedbackMessage =
            "an error has occurred, please contact the ComSI team 😴";
        }
        this.snackbar = true;
        console.log("an error has occurred");
      }
    },

    getRandomBackgroundURL() {
      return BACKGROUNDS_URL[
        Math.floor(Math.random() * BACKGROUNDS_URL.length)
      ];
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
  position: fixed;
  bottom: 20px;
  z-index: 20;
}

.loginBtn {
  right: 20px;
}
.signupBtn {
  left: 20px;
}
</style>
