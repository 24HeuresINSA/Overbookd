<template>
  <div class="register">
    <v-img
      src="https://www.24heures.org/wp-content/uploads/2022/01/img_24h_46e_photoorga.jpg"
      class="img-background"
    ></v-img>
    <v-card class="register-card">
      <v-img
        class="register-illustration"
        src="https://www.24heures.org/wp-content/uploads/2022/01/img_24h_44e_benevoles_dosscene.jpg"
      >
        <v-card-title class="register-title"> 👋 Inscription 👋 </v-card-title>
      </v-img>
      <v-stepper v-model="step" vertical>
        <v-stepper-step :complete="step > 1" step="1" @click="step = 1">
          Devenir Benevole
          <small>Tout ce qu'il faut savoir sur le festival</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <p>Hello et merci d'etre venu jusqu'ici ! 🤗</p>
          <p>
            Le festival des 24 heures de l'INSA n'est possible que grace aux
            plus de
            <strong>350 benevoles</strong> qui, comme toi, ont accepte de venir
            nous donner un coup de main pour preparer, organiser et faire en
            sorte que les festivaliers passent le meilleur moment possible. 🎉
          </p>
          <p>
            Pour que l'on puisse t'accueillir dans les meilleures conditions il
            nous faut cependant quelques informations sur toi et le temps que tu
            souhaites consacrer a nous aider.
          </p>
          <p>
            Si tu as la moindre question sur le festival et ce que tu peux faire
            pour nous aider, n'hesite pas a contacter les
            <a href="mailto:humains@24heures.org">responsables benevoles</a>.
            <br />
            Ils seront tes principaux interlocuteurs en amont et en aval du
            festival. 😎
          </p>
          <v-btn color="primary" @click="step = 2"> C'est parti ! 🚀 </v-btn>
          <v-btn text> Annuler </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="step > 2"
          step="2"
          :rules="[() => !(step > 2)]"
          @click="step = 2"
        >
          Presentation
          <small>Dis nous en un peu plus sur toi</small>
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-form class="data dense personnal-data">
            <v-text-field label="Prénom*" required></v-text-field>
            <v-text-field label="Surnom"></v-text-field>
            <v-text-field label="Nom*" required></v-text-field>
            <v-text-field label="Date de naissance*" type="date" return-object>
            </v-text-field>
          </v-form>
          <v-btn color="primary" @click="step = 3"> Vous savez tout 🕵️</v-btn>
          <v-btn text @click="step = 1"> Revenir</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="step > 3" step="3" @click="step = 3">
          Contact
          <small>Comment on reste connectes ?</small>
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-form class="data contact-data">
            <v-select
              label="Equipe"
              :items="[
                'BDE',
                'Kfet',
                'Karna',
                'Woods',
                'Teckos',
                'Tendrestival',
              ]"
              clearable
              required
              hint="Tu nous rejoins a plusieurs ?"
              persistent-hint
            ></v-select>
            <v-text-field
              label="Email*"
              required
              hint="Pas d'adresse insa 🙏"
              persistent-hint
            ></v-text-field>
            <v-text-field label="Ton 06 ?*" required></v-text-field>
            <v-textarea
              label="Commentaire"
              hint="Laisse nous un petit mot. 💌"
              persistent-hint
            ></v-textarea>
          </v-form>
          <v-btn color="primary" @click="step = 4"> On se capte 🤙 </v-btn>
          <v-btn text @click="step = 2"> Revenir </v-btn>
        </v-stepper-content>

        <v-stepper-step step="4" @click="step = 4">
          Securite <small>Un mot de passe</small>
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-form class="data security-data">
            <v-text-field
              type="password"
              label="Mot de passe*"
              required
              hint="Au moins 1 minuscule, 1 majuscule et 8 caracteres 🔒"
              persistent-hint
            ></v-text-field>

            <v-text-field
              type="password"
              label="Confirme ton mot de passe*"
              required
              hint="Il faut que ca soit le meme 🔒"
              persistent-hint
            ></v-text-field>
          </v-form>
          <v-btn color="primary" disabled @click="step = 1"> M'inscrire </v-btn>
          <v-btn text @click="step = 3"> Revenir </v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Register",
  auth: false,
  layout: "none",
  data() {
    return {
      step: 1,
    };
  },
});
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

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;

  &-card {
    max-width: 1000px;
  }

  &-illustration {
    height: 20vh;
    min-height: 100px;
    max-height: 350px;
  }

  &-title {
    color: #ffffff;
    position: absolute;
    width: 100%;
    bottom: 0px;
    background-color: rgba($color: #000000, $alpha: 0.3);
    justify-content: center;
  }
  .data {
    display: flex;
    flex-direction: column;
    gap: 10px;
    &.dense {
      gap: 0px;
    }
  }
}
</style>
