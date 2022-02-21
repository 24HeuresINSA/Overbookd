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
          <v-col>
            <v-img
              style="transform: translate(100px, 0)"
              src="img/memes/home_meme.jpg"
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
          <h2 style="right: -40%; position: relative; color: red; z-index: 20">
            {{ version }}
          </h2>
        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.username"
            label="email"
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
        <v-row>
          <a class="forgot-a" href="/forgot">Mot de passe oublié ?</a>
          <v-spacer />
          <a class="forgot-a" @click="isDialogOpen = true"
            >Un problème lors de l'inscription ?</a
          >
        </v-row>
      </v-container>
      <v-btn color="secondary" elevation="2" to="/signup" class="signupBtn Btn"
        >s'inscrire
      </v-btn>
      <v-btn color="primary" elevation="2" class="loginBtn Btn" @click="login()"
        >connexion
      </v-btn>
    </v-form>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card>
        <v-card-title>Demander de l'aide</v-card-title>
        <v-card-text>
          <h4>
            Si vous avez rencontré un problème lors de l'inscription vous pouvez
            nous envoyer un mail. Nous nous en occuperons au plus vite.
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="`mailto:humains@24h.org`"> Envoyer le mail </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import qs from "qs";
import jwt_decode from "jwt-decode";

const REDIRECT_URL = "/";
const BACKGROUNDS_URL = [
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_bellecour.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_mome.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_feudartificefinal.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_feder.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_rosalie.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_46e_photoorga.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_danakil.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_directions.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_photoequipe.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_fossegrandescene.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_montagescenehumas-scaled.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevoles_resultatscoursesimg_24h_45e_benevoles_montagecrash.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevoles_paille.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevoles_assis.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_tireuse.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_service.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_repas.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_benevole_maquillage.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_qgorgahaut.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_resultatscourses.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_montagescene.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_dosscene.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevole_trraverseecourse.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevole_poney.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_43e_qgorga.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_42e_benevoles_canapedehors.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_qgorga.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_foodtruck.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_bardecouverte.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_festivaliersdanslherbe-scaled.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_fondgrandescene.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_viragevelo.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_podium.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/courses_caritatives_photo.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_coucoucoureur.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_coucouvelo.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_danse.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_villageprevention.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_tiralarc.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_kavinsky.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_fosse.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_fuzzcall.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img__tremplin_24h_2020_photoartistes.jpg",
  "http://www.24heures.org/wp-content/uploads/2022/01/img_24h_45e_comah.jpg",
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
    console.log(this.$auth);
    if (this.$auth.loggedIn) {
      await this.$router.push({
        path: "/",
      }); // redirect to homepage
    }
  },

  methods: {
    login: async function () {
      try {
        await this.$auth.loginWith("local", { data: this.credentials }); // try to log user in
        console.log("connected to API");
        await this.$router.push({
          path: "/",
        }); // redirect to homepage
        const audio = new Audio("audio/jaune.m4a");
        await audio.play();
      } catch (e) {
        console.error(e);
        console.log("starting migration process...");
        await this.migrate();
      }
    },

    migrate: async function () {
      const data = qs.stringify({
        // keycloak accepts www-urlencoded-form and not JSON
        username: this.credentials.username,
        password: this.credentials.password,
        client_id: "project_a_web",
        grant_type: "password",
      });
      console.log("connection to keycloak...");
      try {
        const response = await this.$axios.post(
          process.env.BASE_URL_KEYCLOAK +
            "auth/realms/project_a/protocol/openid-connect/token/",
          data
        );
        if (
          response.status === 200 &&
          response.data.access_token !== undefined
        ) {
          console.log("connected to keycloak with success 🥳");
          // right credentials, start migration process
          const reset = await this.$axios.$post("/migrate", this.credentials);
          if (reset.token) {
            console.log("user migrated");
            // await this.$auth.loginWith("local", this.credentials); // try to log user in
            this.feedbackMessage =
              "Ton compte a été migrée, dit pas ca au Z 🥳";
            this.snackbar = true;
          }
        } else {
          this.feedbackMessage = "Password or username are incorrect 😞";
          this.snackbar = true;
        }
      } catch (e) {
        this.feedbackMessage =
          "Password or username are incorrect 😞,pense a mettre ton email";
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
.forgot-a {
  z-index: 2;
  background-color: rgba(50, 50, 50, 0.7);
  padding: 0.8rem;
  border-radius: 0.2rem;
  color: white;
}
</style>
