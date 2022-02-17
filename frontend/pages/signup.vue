<template>
  <div>
    <h1>Inscription 👋</h1>
    <OverForm
      v-if="signupForm"
      :fields="signupForm"
      @form-change="onFormChange"
    ></OverForm>
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
      this.signupForm = this.getConfig("signup_form_soft");
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
        alert("t'as pas mis le meme mpd :P");
      } else if (!this.compiledForm.isValid) {
        alert("les champs avec * sont OBLIGATOIRS XD ");
      } else {
        //this.compiledForm.team = "soft"; --> Du coup pas sur que ce soit top étant donné que ça valide la personne automatiquement

        this.$axios.post("/signup", this.compiledForm);
        this.$router.push({
          path: "/login",
        });
        alert(
          `Un mail a été envoyé à ${this.compiledForm.email}. Clickez sur le lien dans le mail pour compléter votre inscription puis vous pouvez vous connecter avec votre email: "${this.compiledForm.email}"`
        );
      }
    },
  },
};
</script>

<style scoped></style>
