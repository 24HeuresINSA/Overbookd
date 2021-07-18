<template>
  <div>
    <h1>Fiche Tache 🤩</h1>
    <over-form
        v-if="FT_FORM"
      :fields="FT_FORM"
      @form-change="onFormChange"
    ></over-form>
  </div>
</template>

<script>
import OverForm from "../../components/overForm";
export default {
  name: "_ft",
  components: {OverForm},
  data() {
    return {
      FTID: this.$route.params.ft,
      FT: {},
      FT_FORM: this.getConfig('ft_form')
    }
  },

  async mounted() {
    let mFT = (await this.$axios.get('/ft/' + this.FTID)).data;
    Object.keys(mFT).forEach(key => {
      let field = this.FT_FORM.find(field => field.key === key);
      if(field){
        this.$set(field, 'value', mFT[key])
        console.log(field)
      }
    })
  },

  methods: {
    onFormChange(form){
      this.FT = form
    },

    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },
  }
}
</script>

<style scoped>

</style>