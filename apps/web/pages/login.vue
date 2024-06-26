<template>
  <div class="background-wrapper">
    <v-img :src="randomURL" class="background" cover />
    <div class="opacity-filter" />
    <div class="scrollable-content">
      <v-form>
        <v-container class="form-container">
          <v-row class="logo">
            <v-img src="/img/logo/logo_home_white.png" alt="overbookd" />
          </v-row>
          <v-row class="version justify-center">
            <h2>{{ version }}</h2>
          </v-row>
          <v-row>
            <v-text-field
              v-model="credentials.email"
              label="Email"
              name="email"
              autocomplete="email"
              inputmode="email"
              type="text"
              bg-color="white"
              required
              autofocus
              outlined
              solo
              @keydown.enter="login"
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model="credentials.password"
              label="Mot de passe"
              type="password"
              bg-color="white"
              required
              outlined
              clearable
              solo
              @keydown.enter="login"
            />
          </v-row>
          <v-row class="ctas">
            <v-btn
              color="primary"
              elevation="2"
              rounded="xl"
              class="btn btn-primary"
              @click="login"
            >
              connexion
            </v-btn>
            <v-btn
              color="secondary"
              elevation="2"
              to="/register"
              rounded="xl"
              class="btn btn-secondary"
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
            Si vous avez rencontré un problème lors de l'inscription vous pouvez
            nous envoyer un mail à l'adresse humains@24heures.org
            <br />
            Nous nous en occuperons au plus vite.
          </v-card-text>
          <v-card-actions>
            <v-btn :href="`mailto:humain@24heures.org`">
              Envoyer le mail
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { sendNotification } from "~/utils/notification/send-notification";

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

definePageMeta({ layout: false });

const config = useRuntimeConfig();
const version = config.public.version;
const router = useRouter();

const authStore = useAuthStore();
const { authenticated } = storeToRefs(authStore);

const randomURL =
  BACKGROUNDS_URL[Math.floor(Math.random() * BACKGROUNDS_URL.length)];

const credentials = ref({
  email: "",
  password: "",
});
const isDialogOpen = ref(false);

const login = async () => {
  if (!credentials.value.email.trim() || !credentials.value.password.trim()) {
    return sendNotification(
      "Hmmm, t'aurais pas oublié de remplir quelque chose ?",
    );
  }
  await authStore.login(credentials.value);
  if (authenticated) router.push("/");
};
</script>

<style lang="scss" scoped>
.background-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.background {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
}

.opacity-filter {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.scrollable-content {
  position: relative;
  z-index: 3;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

.logo {
  width: 20em;
  height: 20em;
  align-self: center;
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
  margin-top: 5%;
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
  .form-container {
    margin-top: 15%;
  }

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
