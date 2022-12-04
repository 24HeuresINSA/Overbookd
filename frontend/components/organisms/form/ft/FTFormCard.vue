<template>
  <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
    <v-card-title>Général</v-card-title>
    <v-card-text>
      <v-text-field
        :v-model="name"
        :value="data"
        label="Nom de la FT"
        :disabled="disabled"
        @change="onFormChange"
      ></v-text-field>
      <v-autocomplete
        :v-model="inCharge"
        :value="data"
        label="Orga responsable"
        :items="users"
        :disabled="disabled"
        dense
        @change="onFormChange"
      ></v-autocomplete>
      <v-text-field
        :v-model="location"
        :value="data"
        label="Lieu du rdv 📍"
        :disabled="disabled"
        @change="onFormChange"
      ></v-text-field>
      <v-select
        :v-model="isDriverLicenseRequired"
        :value="data"
        label="Permis necessaire"
        :items="items"
        :disabled="disabled"
        dense
        @change="onFormChange"
      ></v-select>
      <v-switch
        :v-model="isSecurity"
        :value="data"
        label="Tâche de sécurité"
        :disabled="disabled"
        @change="onFormChange"
      ></v-switch>
      <v-textarea
        :v-model="instructions"
        :value="data"
        label="Consignes"
        required
        :disabled="disabled"
        @change="onFormChange"
      ></v-textarea>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "FTFormCard",
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
      items: ["non", "permis - un ans", "permis + un ans", "conducteur de Fen"],
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
