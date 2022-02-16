<template>
  <div>
    <h1>Inscription 👋</h1>
    <div class="swicthContainer">
      <h3 class="warning_title">
        Veuillez impérativement séléctionner le bon formulaire, toute demande en
        Hard non justifié sera ignorée
      </h3>
      <v-switch
        v-model="wichForm"
        :label="`Inscription : ${switchLabel()}`"
      ></v-switch>
    </div>
    <div v-if="wichForm">
      <OverForm
        v-if="signupForm"
        :fields="signupForm"
        @form-change="onFormChange"
      ></OverForm>
      <v-btn color="primary" @click="submitForm">Envoyer</v-btn>
    </div>
    <div v-else>
      <OverForm
        v-if="softForm"
        :fields="softForm"
        @form-change="onFormChange"
      ></OverForm>
      <v-btn color="primary" @click="submitForm">Envoyer</v-btn>
    </div>
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
      softForm: undefined,
      compiledForm: undefined,
      wichForm: false,
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
      this.softForm = this.getConfig("signup_form_soft");
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
        this.$axios.post("/signup", this.compiledForm);
        this.$router.push({
          path: "/login",
        });
        alert(
          `Un mail a été envoyé à ${this.compiledForm.email}. Clickez sur le lien dans le mail pour compléter votre inscription puis vous pouvez vous connecter avec votre email: "${this.compiledForm.email}"`
        );
      }
    },

    switchLabel() {
      return this.wichForm ? "Hard" : "Soft";
    },
  },
};
</script>

<style scoped>
.warning_title {
  color: red;
  font-style: italic;
}
</style>
