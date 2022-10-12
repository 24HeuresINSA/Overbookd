<template>
  <div>
    <h1>Inscription 👋</h1>
    <OverForm
      v-if="signupForm"
      :fields="signupForm"
      @form-change="onFormChange"
    ></OverForm>
    <p>
      Une fois le formulaire remplit veuillez vous connecter à Overbookd pour
      remplir vos dispos ! <br />
      <span class="important"
        >Pensez à immédiatement les remplir pour être accepté au plus vite
        !</span
      >
    </p>
    <v-btn color="primary" @click="submitForm">Envoyer</v-btn>
  </div>
</template>

<script>
import { getConfig } from "~/common/role";
import OverForm from "../components/overForm";

export default {
  name: "Signup",
  components: { OverForm },
  auth: false,
  layout: "none",

  data() {
    return {
      signupForm: undefined,
      compiledForm: undefined,
    };
  },

  async mounted() {
    // fetch from API to check that sign ups are open
    const isSignupOpen = this.getConfig("isSignupOpen");
    if (!isSignupOpen) {
      alert(this.getConfig("fb_signup_closed"));
      await this.$router.push({
        path: "/login",
      });
    } else {
      this.signupForm = this.getConfig("signup_form");
    }
  },

  methods: {
    getConfig(key) {
      return getConfig(this, key);
    },

    onFormChange(form) {
      this.compiledForm = form;
    },

    submitForm() {
      if (this.compiledForm.password !== this.compiledForm.password2) {
        alert("Les deux mots de passes ne sont pas les mêmes");
      } else if (!this.compiledForm.isValid) {
        alert("Les champs avec * sont obligatoires");
      } else {
        delete this.compiledForm.password2;
        delete this.compiledForm.isValid;
        const oldDate = this.compiledForm.birthdate;
        this.compiledForm.birthdate = new Date(oldDate).toISOString();
        this.$axios.post("/user", this.compiledForm);
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
