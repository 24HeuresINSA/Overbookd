<template>
  <v-card class="signup-card elevation-3">
    <v-card-title class="card-title justify-center"
      >👋 Inscription 👋</v-card-title
    >
    <v-card-text>
      <v-form v-model="signupData.isValid">
        <v-text-field
          v-model="signupData.firstname"
          label="Prénom*"
          required
        ></v-text-field>

        <v-text-field
          v-model="signupData.lastname"
          label="Nom*"
          required
        ></v-text-field>

        <v-text-field
          v-model="signupData.nickname"
          label="Surnom"
        ></v-text-field>

        <v-text-field
          v-model="signupData.password"
          type="password"
          label="Mot de passe*"
          :rules="regexPassword"
          required
        ></v-text-field>

        <v-text-field
          v-model="signupData.password2"
          type="password"
          label="Confirme ton mot de passe*"
          :rules="regexPassword"
          required
        ></v-text-field>

        <div class="date-picker">
          <p>Date de naissance*</p>
          <v-date-picker
            v-model="birthdate"
            label="Date de naissance*"
            elevation="1"
          ></v-date-picker>
        </div>

        <v-text-field
          v-model="signupData.email"
          label="Gmail (gmail.com ou 24heures.org uniquement)*"
          :rules="regexEmail"
          required
        ></v-text-field>

        <v-text-field
          v-model="signupData.phone"
          label="Ton 06 ?*"
          :rules="regexPhone"
          required
        ></v-text-field>

        <v-select
          v-model="signupData.department"
          label="Département (obligatoire même si non INSA)*"
          :items="[
            'TC',
            'IF',
            'BS',
            'GCU',
            'SGM',
            'GI',
            'GM',
            'GEN',
            'FIMI',
            'GE',
            'AUTRE',
          ]"
          :rules="ruleSelectComplete"
          required
        ></v-select>

        <v-select
          v-model="signupData.year"
          label="Année (obligatoire même si non INSA)*"
          :items="['A1', 'A2', 'A3', 'A4', 'A5', 'VIEUX', 'AUTRE']"
          :rules="ruleSelectComplete"
          required
        ></v-select>

        <v-select
          v-if="formSoft"
          v-model="signupData.team"
          label="Team affiliée (laisser vide si non concerné)"
          :items="['BDE', 'Kfet', 'Karna', 'Woods', 'Teckos', 'Tendrestival']"
          clearable
          required
        ></v-select>

        <v-text-field
          v-model="signupData.comment"
          label="Commentaire"
        ></v-text-field>

        <p>
          Une fois le formulaire remplit veuillez vous connecter à Overbookd
          pour remplir vos dispos ! <br />
          <span class="important"
            >Pensez à immédiatement les remplir pour être accepté au plus vite
            !</span
          >
        </p>
        <div class="submit-btn">
          <v-btn color="primary" large @click="submitForm">S'inscrire</v-btn>
        </div>
      </v-form>
    </v-card-text>
    <SnackNotificationContainer></SnackNotificationContainer>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default Vue.extend({
  name: "Signup",
  auth: false,
  components: { SnackNotificationContainer },
  layout: "none",

  data: () => ({
    signupData: {} as SignupFormData,
    birthdate: "",
    formSoft: false,
    isSignupOpen: true,
  }),

  computed: {
    regexPassword(): any {
      return [
        (v: any) =>
          new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$`).test(v) ||
          `au moins une MAJUSCULE, minuscule et un chiffre et au moins 6 caractères`,
      ];
    },
    regexEmail(): any {
      return [
        (v: any) =>
          new RegExp(`^.+@(gmail.com|24heures.org)$`).test(v) ||
          `cette adresse mail n'est pas valide`,
      ];
    },
    regexPhone(): any {
      return [
        (v: any) =>
          new RegExp(`0[6-7]{1}[0-9]{8}$`).test(v) ||
          `ce numéro de téléphone n'est pas valide`,
      ];
    },
    ruleSelectComplete(): any {
      return [(v: any) => !!v];
    },
  },

  async mounted() {
    if (!this.isSignupOpen) {
      alert("Les inscriptions sont fermées 😱");
      await this.$router.push({
        path: "/login",
      });
    }
  },

  methods: {
    async submitForm() {
      if (this.signupData.password !== this.signupData.password2) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "❌ Les deux mots de passes ne sont pas identiques...",
        });
      }

      if (!this.signupData.isValid || !this.birthdate) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "❌ Les champs avec * sont obligatoires !",
        });
      }

      delete this.signupData.password2;
      delete this.signupData.isValid;
      this.signupData.birthdate = new Date(this.birthdate).toISOString();

      const res = await this.$axios.post("/user", this.signupData);
      if (res.status !== 201) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "error",
          message: "Une erreur est survenue 😱",
        });
      }

      await this.$store.dispatch("notif/pushNotification", {
        type: "success",
        message: "🎉 Inscription terminée Bienvenue au 24 ! 🎉",
      });
      this.$router.push({ path: "/login" });
    },
  },
});

interface SignupFormData {
  firstname: string;
  lastname: string;
  nickname: string;
  password: string;
  password2?: string;
  birthdate: any;
  email: string;
  phone: string;
  department: string;
  year: string;
  team?: string;
  comment: string;
  isValid?: boolean;
}
</script>

<style scoped>
.signup-card {
  padding: 5px 20px;
}

.card-title {
  font-size: 28px;
}

.date-picker {
  margin: 10px 0;
}

.date-picker p {
  margin-bottom: 5px;
}

.important {
  font-weight: bold;
  color: red;
}

.submit-btn {
  justify-content: center;
  text-align: center;
}
</style>
