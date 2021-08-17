<template>
  <div>
    <over-field
        v-for="field in fields"
        :key="field.label"
        :field="field"
        @value="onValueChange"
    >
    </over-field>
  </div>
</template>

<script>
import OverField from "./overField";

export default {
  name: "over-form",
  components: {OverField},
  props: ["fields"],

  data(){
    return {
      compiledForm: {},
    }
  },

  mounted() {
  },

  methods: {
    onValueChange({key, value}) {
      this.compiledForm[key] = value;
      let isValid = true;
      this.fields.forEach(field => {
        if(field.value){
          this.compiledForm[field.key] = field.value;
        } else {
          if(field.isRequired === true){
            isValid = false;
            // console.log('field ' + field.key + ' is required')
          }
        }
      })
      this.compiledForm.isValid = isValid;
      this.$emit('form-change', this.compiledForm)
    }
  }
}
</script>

<style scoped>

</style>