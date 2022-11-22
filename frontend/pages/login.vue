<template>
  <div>
    <v-img :src="randomURL" class="img-background"></v-img>
    <v-form>
      <v-container class="form-container">
        <v-row>
          <v-col>
            <v-img
              src="img/memes/home_meme.jpg"
              class="img-center"
              max-height="350"
              max-width="350"
            ></v-img>
          </v-col>
        </v-row>
        <v-row>
          <v-img
            src="img/logo/overbookd_logo_blanc.png"
            alt="overbookd"
            class="logo"
          ></v-img>
        </v-row>
        <v-row>
          <h2 class="version">
            {{ version }}
          </h2>
        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.email"
            label="email"
            type="text"
            required
            autofocus
            outlined
            solo
            filled
            @keydown.enter="login()"
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
        <v-row>
          <a class="forgot-a" href="/forgot">Mot de passe oublié ?</a>
          <v-spacer />
          <a class="forgot-a" @click="isDialogOpen = true"
            >Un problème lors de l'inscription ?</a
          >
        </v-row>
      </v-container>
      <v-btn color="secondary" elevation="2" to="/signup" class="signupBtn btn"
        >s'inscrire
      </v-btn>
      <v-btn color="primary" elevation="2" class="loginBtn btn" @click="login()"
        >connexion
      </v-btn>
    </v-form>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card>
        <v-card-title>Demander de l'aide</v-card-title>
        <v-card-text>
          <h4>
            Si vous avez rencontré un problème lors de l'inscription vous pouvez
            nous envoyer un mail à l'adresse humains@24heures.org <br />
            Nous nous en occuperons au plus vite.
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="`mailto:humains@24heures.org`"> Envoyer le mail </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
const REDIRECT_URL = "/";
const BACKGROUNDS_URL = [
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_bellecour.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_mome.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_feudartificefinal.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_feder.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_rosalie.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_46e_photoorga.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_danakil.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_directions.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_photoequipe.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_fossegrandescene.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_montagescenehumas-scaled.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevoles_resultatscoursesimg_24h_45e_benevoles_montagecrash.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevoles_paille.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevoles_assis.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_tireuse.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_service.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_repas.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_maquillage.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_qgorgahaut.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_resultatscourses.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_montagescene.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_dosscene.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevole_trraverseecourse.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevole_poney.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_43e_qgorga.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_42e_benevoles_canapedehors.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_qgorga.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_foodtruck.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_bardecouverte.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_festivaliersdanslherbe-scaled.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_fondgrandescene.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_viragevelo.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_podium.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/courses_caritatives_photo.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_coucoucoureur.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_coucouvelo.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_danse.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_villageprevention.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_tiralarc.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_kavinsky.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_fosse.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_fuzzcall.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img__tremplin_24h_2020_photoartistes.jpg",
  "https://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_comah.jpg",
];
const { version } = require("../package.json");

export default {
  name: "Login",
  auth: false,
  layout: "none",

  data: () => ({
    credentials: {
      email: "",
      password: "",
    },
    snackbar: false,
    feedbackMessage: undefined,
    timeout: 5000,
    version,
    randomURL: undefined,
    isDialogOpen: false,
  }),

  async beforeCreate() {
    if (this.$auth.loggedIn) {
      await this.$router.push({
        path: REDIRECT_URL,
      }); // redirect to homepage
    }
  },

  async mounted() {
    this.randomURL = this.getRandomBackgroundURL();
    if (this.$auth.loggedIn) {
      await this.$router.push({
        path: REDIRECT_URL,
      }); // redirect to homepage
    }
  },

  methods: {
    login: async function () {
      try {
        if (this.credentials.email && this.credentials.password) {
          await this.$auth.loginWith("local", { data: this.credentials }); // try to log user in
          await this.$router.push({
            path: REDIRECT_URL,
          }); // redirect to homepage
          const audio = new Audio("audio/jaune.m4a");
          await audio.play();
        }
      } catch (e) {
        this.feedbackMessage = "Ton email ou ton mot de passe est incorrect 😞";
        this.snackbar = true;
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
.img-background {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  padding: 0;
}

.img-center {
  transform: translate(100px, 0);
}

.version {
  right: -40%;
  position: relative;
  color: red;
  z-index: 20;
}

.form-container {
  align-self: center;
  justify-self: center;
  margin-top: 10%;
  width: 75%;
  max-width: 600px;
}

.btn {
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

.forgot-a {
  z-index: 2;
  background-color: rgba(50, 50, 50, 0.7);
  padding: 0.8rem;
  border-radius: 0.2rem;
  color: white;
}
</style>
