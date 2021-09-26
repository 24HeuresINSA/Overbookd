<template>
  <v-container>
    <h1>Config ⚙️ (work in progress)</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <h2>Inscription</h2>
    <v-switch
      v-model="config.isSignupOpen"
      label="Ouverture des inscription"
    ></v-switch>
    <v-text-field
      v-model="config.fb_signup_closed"
      label="message de fermeture"
    ></v-text-field>

    <h2>FA</h2>
    <v-text-field
      v-model="config.fb_confirm_submit"
      label="message de confirmation"
    ></v-text-field>

    <h2>Dispo</h2>
    <v-text-field
      v-model="config.max_charisma"
      label="charisme max"
      type="number"
    ></v-text-field>
    <v-textarea
      v-model="config.availabilities_description"
      label="description des dispo"
      type="number"
    ></v-textarea>

    <h2>Log</h2>
    <v-switch
      v-model="config.isInventoryOpen"
      label="ouvrir l'edition de l'inventaire au hard"
    ></v-switch>
  </v-container>
</template>

<script>
import { getConfig, hasRole } from "../common/role";

export default {
  name: "Config",

  data() {
    return {
      config: {
        isSignupOpen: getConfig(this, "isSignupOpen"),
        fb_signup_closed: getConfig(this, "fb_signup_closed"),
        fb_confirm_submit: getConfig(this, "fb_confirm_submit"),
        availabilities_description: getConfig(
          this,
          "availabilities_description"
        ),
        max_charisma: getConfig(this, "max_charisma"),
        isInventoryOpen: getConfig(this, "isInventoryOpen"),
      },
    };
  },

  async mounted() {
    if (hasRole(this, ["admin", "bureau"])) {
      //TODO: Invert this to avoid empty if
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },
};
</script>

<style scoped></style>
