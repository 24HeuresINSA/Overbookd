<template>
  <div>
    <OverField
      v-for="field in fields"
      :key="field.key"
      :field="field"
      :disabled="disabled"
      :data="getData(field.key)"
      @value="onValueChange"
    >
    </OverField>
  </div>
</template>

<script>
import OverField from "./overField";

export default {
  name: "OverForm",
  components: { OverField },
  props: ["fields", "data", "disabled"],

  data() {
    return {
      compiledForm: {},
    };
  },

  mounted() {},

  methods: {
    getData(key) {
      if (this.data) {
        return this.data[key];
      }
    },

    onValueChange({ key, value }) {
      this.compiledForm[key] = value;
      let isValid = true;
      this.fields.forEach((field) => {
        if (field.value) {
          this.compiledForm[field.key] = field.value;

          // check regex
          if (field.regex) {
            let r = new RegExp(field.regex);
            if (!r.test(field.value)) {
              isValid = false;
            }
          }
        } else {
          if (field.isRequired === true) {
            isValid = false;
          }
        }
      });
      this.compiledForm.isValid = isValid;
      this.$emit("form-change", this.compiledForm);
    },
  },
};
</script>

<style scoped></style>
