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
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { getConfig } from "~/common/role";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Snack } from "~/utils/models/snack";
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
      snack: new Snack(),
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

    async submitForm() {
      if (!this.compiledForm) {
        this.snack.display("Veuillez remplir le formulaire !");
        return;
      }
      if (this.compiledForm.password !== this.compiledForm.password2) {
        this.snack.display("Les deux mots de passes ne sont pas les mêmes");
      } else if (!this.compiledForm.isValid) {
        this.snack.display("Les champs avec * sont obligatoires");
      } else {
        delete this.compiledForm.password2;
        delete this.compiledForm.isValid;
        const oldDate = this.compiledForm.birthdate;
        this.compiledForm.birthdate = new Date(oldDate).toISOString();
        const res = await safeCall(
          this.$store,
          RepoFactory.userRepo.setUser(this, this.compiledForm)
        );
        if (!res) {
          return this.snack.display(
            "☠ Une erreur est survenue, vérifie les champs"
          );
        }

        this.snack.display("Inscription réussie !🎉 Redirection au login...");
        setTimeout(() => {
          this.$router.push({
            path: "/login",
          });
        }, 1000);
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
