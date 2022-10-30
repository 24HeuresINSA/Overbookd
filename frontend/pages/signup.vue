<template>
  <div>
    <h1>Inscription 👋</h1>
    <v-form v-model="formData.isValid">
      <v-text-field
        v-model="formData.firstname"
        type="given-name"
        label="Prénom*"
        required
      ></v-text-field>

      <v-text-field
        v-model="formData.lastname"
        type="family-name"
        label="Nom*"
        required
      ></v-text-field>

      <v-text-field
        v-model="formData.nickname"
        label="Surnom"
      ></v-text-field>

      <v-text-field
        v-model="formData.password"
        type="password"
        label="Mot de passe*"
        :rules="
          [
            (v) =>
              new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$`).test(v) ||
              (`au moins une MAJUSCULE, minuscule et un chiffre et au moins 6 caractères`),
          ]
        "
        required
      ></v-text-field>

      <v-text-field
        v-model="formData.password2"
        type="password"
        label="Confirme ton mot de passe*"
        :rules="
          [
            (v) =>
              new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$`).test(v) ||
              (`au moins une MAJUSCULE, minuscule et un chiffre et au moins 6 caractères`),
          ]
        "
        required
      ></v-text-field>

      <div>
        <p>Date de naissance*</p>
        <v-date-picker
          v-model="formData.birthdate"
          label="Date de naissance*"
          :active-picker.sync="activePicker"
          required
        ></v-date-picker>
      </div>

      <v-text-field
        v-model="formData.email"
        type="email"
        label="Gmail (important que ca soit une adresse gmail)*"
        :rules="
          [
            (v) =>
              new RegExp(`^.+@(gmail.com|24heures.org)$`).test(v) ||
              (`il y a un problème avec ce champ`),
          ]
        "
        required
      ></v-text-field>

      <v-text-field
        v-model="formData.phone"
        type="tel"
        label="Ton 06 ?*"
        :rules="
          [
            (v) =>
              new RegExp(`0[6-7]{1}[0-9]{8}$`).test(v) ||
              (`il y a un problème avec ce champ`),
          ]
        "
        required
      ></v-text-field>

      <v-select
        v-model="formData.department"
        type="select"
        label="Département (obligatoire même si non INSA)*"
        :items="['TC', 'IF', 'BS', 'GCU', 'SGM', 'GI', 'GM', 'GEN', 'FIMI', 'GE', 'AUTRE']"
        dense
        required
      ></v-select>

      <v-select
        v-model="formData.year"
        type="select"
        label="Année (obligatoire même si non INSA)*"
        :items="['A1', 'A2', 'A3', 'A4', 'A5', 'VIEUX', 'AUTRE']"
        dense
        required
      ></v-select>

      <v-text-field
        v-model="formData.comment"
        label="Commentaire"
      ></v-text-field>

      <p>
        Une fois le formulaire remplit veuillez vous connecter à Overbookd pour
        remplir vos dispos ! <br />
        <span class="important"
          >Pensez à immédiatement les remplir pour être accepté au plus vite
          !</span
        >
      </p>
      <v-btn color="primary" @click="submitForm">Envoyer</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "Signup",
  auth: false,
  layout: "none",

  data: () => {
    return {
      formData: {
        type: Object,
        default: () => undefined,
      },
      activePicker: null,
    }
  },

  async mounted() {
    const isSignupOpen = true;  //Close or open signup
    if (!isSignupOpen) {
      alert("les inscriptions sont fermées 😱");
      await this.$router.push({
        path: "/login",
      });
    }
  },

  methods: {
    submitForm() {
      console.log(this.formData);
      if (this.formData.password !== this.formData.password2) {
        alert("Les deux mots de passes ne sont pas les mêmes");
      } else if (!this.formData.isValid) {
        alert("Les champs avec * sont obligatoires");
      } else {
        delete this.formData.password2;
        delete this.formData.isValid;
        const oldDate = this.formData.birthdate;
        this.formData.birthdate = new Date(oldDate).toISOString();
        this.$axios.post("/user", this.formData);
        this.$router.push({
          path: "/login",
        });
        alert(`🎉Inscription terminée Bienvenue au 24 !🎉`);
      }
    },
  },
};
</script>

<style scoped>
.important {
  font-weight: bold;
  color: red;
}
</style>
