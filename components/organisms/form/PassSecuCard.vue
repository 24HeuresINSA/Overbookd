<template>
  <v-card>
    <v-card-title>Pass Sécu</v-card-title>
    <v-card-text>
      <v-switch
        v-model="isPassSecuRequired"
        label="Besoin de pass sécu"
      ></v-switch>

      <v-data-table
        :headers="headers"
        :items="securityPasses"
        items-per-page="-1"
        hide-default-footer
      ></v-data-table>

      <template v-if="isPassSecuRequired">
        <OverForm
          :fields="FORM"
          :disabled="isDisabled"
          @form-change="onFormChange"
        ></OverForm>
        <v-btn text>Ajouter demande de pass secu</v-btn>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import OverForm from "../../overForm";

export default {
  name: "PassSecuCard",
  components: { OverForm },
  props: {
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
  data: function () {
    return {
      isPassSecuRequired: false,
      topic: "secu",
      formKey: "fa_security_form",
      FORM: [],
      // datatable
      headers: [
        { text: "nom", value: "fullname" },
        { text: "email", value: "email" },
        {
          text: "plaque d'immatriculation",
          value: "licensePlate",
        },
        { text: "tel", value: "phone" },
        { text: "commentaire", value: "comment" },
      ],
    };
  },
  computed: {
    securityPasses: function () {
      return this.$accessor.FA.mFA.securityPasses;
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
