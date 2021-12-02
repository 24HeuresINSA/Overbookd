<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Ajouter un lieu</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="fields.name"
            :rules="[(v) => !!v || 'Location is required']"
            label="Localisation"
            required
          ></v-text-field>
          <v-select
            v-model="fields.neededBy"
            :items="neededByList"
            label="Pour qui ?"
            multiple
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="dialog = false">Annuler</v-btn>
        <v-btn color="blue darken-1" @click="onSubmit">Sauvegarder</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "LocationAdder",
  data() {
    return {
      dialog: false,
      fields: {
        name: "",
        neededBy: [],
      },
      neededByList: ["SIGNA", "INVENTAIRE"],
      valid: false,
    };
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate();
      if (!this.valid) return;
      this.$store.dispatch("location/createNewLocation", this.fields);
      this.dialog = false;
    },
    openDialog() {
      this.dialog = true;
    },
  },
};
</script>

<style></style>
