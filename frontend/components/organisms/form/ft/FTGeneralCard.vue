<template>
    <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
      <v-card-title>Général</v-card-title>
      <v-card-text>
        <v-text-field
        :v-model="name"
        :value="data"
        :label="Nom de la FT"
        :disabled="disabled"
        @change="onFormChange"
        ></v-text-field>
        <v-autocomplete
        :v-model="inCharge"
        :value="data"
        :label="Responsable"
        :items="users"
        :disabled="disabled"
        dense
        @change="onFormChange"
        ></v-autocomplete>
        <v-switch
        :v-model="areTimeframesStatic"
        :value="data"
        :label="Créneaux statiques"
        :disabled="disabled"
        @change="onFormChange"
        ></v-switch>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import OverForm from "../../overForm";
  
  export default {
    name: "FTGeneralCard",
    components: { OverForm },
    props: {
      topic: {
        type: String,
        default: () => "",
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
    },
    methods: {
      onFormChange(form) {
        this.$emit("form-change", form);
      },
    },
  };
  </script>
  
  <style scoped></style>
  