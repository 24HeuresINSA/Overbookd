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
  props: {
    fields: {
      type: Array,
      default: () => undefined,
    },
    data: {
      type: Object,
      default: () => undefined,
    },
    disabled: Boolean,
  },

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
        // check regex
        if (field.regex) {
          let r = new RegExp(field.regex);
          if (!r.test(this.compiledForm[field.key])) {
            isValid = false;
            console.log(`field not correct ${field.key}`);
          }
        }

        if (field.isRequired && this.compiledForm[field.key] === undefined) {
          isValid = false;
          console.log(
            `field not entered ${field.key} ${this.compiledForm[field.key]}`
          );
        }
      });
      this.compiledForm.isValid = isValid;
      this.$emit("form-change", this.compiledForm);
    },
  },
};
</script>

<style scoped></style>
