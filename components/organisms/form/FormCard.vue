<template>
  <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ details }}</v-card-subtitle>
    <v-card-text>
      <OverForm
        :fields="FORM"
        :disabled="isDisabled"
        :data="data"
        @form-change="onFormChange"
      ></OverForm>
    </v-card-text>
  </v-card>
</template>

<script>
import OverForm from "../../overForm";

export default {
  name: "FormCard",
  components: { OverForm },
  props: {
    topic: {
      type: String,
      default: () => "",
    },
    title: {
      type: String,
      default: () => {
        "";
      },
    },
    formKey: {
      type: String,
      default: () => {
        null;
      },
    },
    details: {
      type: String,
      default: () => "",
    },
    isDisabled: {
      type: Boolean,
      default: () => {
        false;
      },
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => {
    return {
      FORM: undefined,
    };
  },
  computed: {
    data: function () {
      return this.form[this.topic];
    },
  },
  mounted() {
    this.FORM = Array.from(this.$accessor.config.getConfig(this.formKey));
    console.log(this.data);
  },
  methods: {
    onFormChange(form) {
      this.$emit("form-change", form);
    },
  },
};
</script>

<style scoped></style>
