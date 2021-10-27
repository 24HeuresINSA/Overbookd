<template>
  <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
    <v-card-title>{{ title }}</v-card-title>
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
    isDisabled: {
      type: Boolean,
      default: () => {
        false;
      },
    },
  },
  data: () => {
    return {
      FORM: undefined,
    };
  },
  computed: {
    mFA: function () {
      return this.$accessor.FA.mFA || {};
    },
    data: function () {
      return this.$store.state.FA.mFA[this.topic];
    },
  },
  mounted() {
    this.FORM = Array.from(this.$accessor.config.getConfig(this.formKey));
  },
  methods: {
    onFormChange(form) {
      this.$emit("form-change", form);
    },
  },
};
</script>

<style scoped></style>
