<template>
  <div>
    <v-img :src="randomURL" class="img-background"></v-img>
    <div class="opacity-filter"></div>
    <v-form>
      <v-container class="form-container">
        <v-row class="logo">
          <v-img src="img/logo/logo_home_white.png" alt="overbookd" />
        </v-row>
        <v-row class="version justify-center">
          <h2>{{ version }}</h2>
        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.email"
            label="email"
            name="email"
            autocomplete="email"
            inputmode="email"
            type="text"
            required
            autofocus
            outlined
            solo
            @keydown.enter="login()"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="credentials.password"
            label="mot de passe"
            type="password"
            required
            outlined
            clearable
            solo
            @keydown.enter="login()"
          ></v-text-field>
        </v-row>
        <v-row class="ctas">
          <v-btn
            color="primary"
            elevation="2"
            class="login-btn btn btn-primary"
            @click="login"
          >
            connexion
          </v-btn>
          <v-btn
            color="secondary"
            elevation="2"
            class="btn btn-secondary"
            to="/register"
          >
            s'inscrire
          </v-btn>
        </v-row>
        <v-row class="ctas">
          <v-btn class="btn btn-tertiary" to="/forgot">
            Mot de passe oublié ?
          </v-btn>
          <v-btn class="btn btn-tertiary" @click="isDialogOpen = true">
            Un problème
            <span class="desktop">&nbsp;lors de l'inscription </span>?
          </v-btn>
        </v-row>
      </v-container>
    </v-form>

    <v-dialog v-model="isDialogOpen" max-width="800">
      <v-card>
        <v-card-title>Demander de l'aide</v-card-title>
        <v-card-text>
          <h4>
            Si vous avez rencontré un problème lors de l'inscription vous pouvez
            nous envoyer un mail à l'adresse humains@24heures.org
            <br />
            Nous nous en occuperons au plus vite.
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="`mailto:humains@24heures.org`"> Envoyer le mail </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

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
  "https://www.24heures.org/wp-content/uploads/2023/05/img_24h_48e_confettis-scaled.jpg",
  "https://live.staticflickr.com/65535/53033340706_729e5f653d_b.jpg",
  "https://live.staticflickr.com/65535/53033819508_78a3ef2495_b.jpg",
  "https://live.staticflickr.com/65535/52617420469_0994528701_b.jpg",
];

const version = process.env.OVERBOOKD_VERSION;

export default Vue.extend({
  name: "Login",
  auth: false,
  components: { SnackNotificationContainer },
  layout: "none",

  data: () => ({
    credentials: {
      email: "",
      password: "",
    },
    feedbackMessage: undefined,
    timeout: 5000,
    version,
    randomURL: "",
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
    async login() {
      try {
        if (this.credentials.email && this.credentials.password) {
          await this.$auth.loginWith("local", { data: this.credentials }); // try to log user in
          await this.$router.push({
            path: REDIRECT_URL,
          }); // redirect to homepage
          const audio = new Audio("audio/jaune.m4a");
          await audio.play();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- can't cast with instanceof
      } catch (e: any) {
        if (e.response.status === 429) {
          return this.$store.dispatch("notif/pushNotification", {
            type: "error",
            message:
              "Tu as essayé de te connecter trop de fois ... 👨‍💻 Attends 30 secs",
          });
        }
        if (e.response.status === 423) {
          return this.$store.dispatch("notif/pushNotification", {
            type: "error",
            message:
              "Ton compte est bloqué pour le moment... 🤷‍♂️ Envoie un mail à overbookd@24heures.org",
          });
        }
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "Ton email ou ton mot de passe est incorrect 😞",
        });
      }
    },

    getRandomBackgroundURL() {
      return BACKGROUNDS_URL[
        Math.floor(Math.random() * BACKGROUNDS_URL.length)
      ];
    },
  },
});
</script>

<style scoped lang="scss">
.logo {
  width: 20em;
  height: 20em;
  align-self: center;
}

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

.opacity-filter {
  opacity: 0.3;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  padding: 0;
  background-color: black;
}

.version {
  z-index: 20;
  text-align: center;
  position: relative;

  h2 {
    color: white;
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-self: center;
  margin-top: 10%;
  width: 75%;
  max-width: 600px;
}

.ctas {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  .btn {
    border-radius: 20px/50%;
    &-primary,
    &-secondary {
      height: 48px;
      width: 100%;
    }
    &-tertiary {
      background-color: rgba(50, 50, 50, 0.7);
      color: white;
      height: 36px;
      width: 60%;
      font-size: 0.7rem;
    }
  }
}

@media only screen and (max-width: 740px) {
  .sub-form {
    flex-direction: column;

    .problem-btn {
      margin-top: 115px;
      position: absolute;
    }
  }
  .desktop {
    display: none;
  }
  .ctas {
    .btn {
      &-tertiary {
        width: 90%;
      }
    }
  }
}
</style>
