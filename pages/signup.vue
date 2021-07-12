<template>
  <div>
    <over-form
      v-if="signupForm"
      :fields="signupForm"
    ></over-form>
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
      if (this.$store.state.config.data.data.find(e => e.key === key).value === 'false'){
        return false
      }
      else if (this.$store.state.config.data.data.find(e => e.key === key).value === 'true'){
        return true
      }
      return this.$store.state.config.data.data.find(e => e.key === key).value
    }
  }

}
</script>

<style scoped>

</style>