<template>
  <div>
    <over-form
      v-if="signupForm"
      :fields="signupForm"
      @form-change="onFormChange"
    ></over-form>
    <v-btn color="primary" @click="submitForm">Envoyer</v-btn>
  </div>
</template>

<script>
import OverForm from "../components/overForm";

export default {
  name: "signup",
  components: {OverForm},
  // layout: "none",
  auth: false,

  data(){
    return {
      signupForm : undefined,
      compiledForm : undefined,
    }
  },

  async mounted(){
    // fetch from API to check that sign ups are open
    const isSignupOpen = this.getConfig('isSignupOpen');
    if(!isSignupOpen){
      alert(this.getConfig('fb_signup_closed'));
      await this.$router.push({
        path: '/login',
      })
    } else {
      this.signupForm = this.getConfig('signup_form');

    }
  },

  methods: {
    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },

    onFormChange(form){
      this.compiledForm = form;
    },

    submitForm(){
      // TODO verify the form validity
      this.$axios.post('/user',this.compiledForm);
      this.$router.push({
        path: '/login',
      })
    }
  }

}
</script>

<style scoped>

</style>