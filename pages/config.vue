<template>
  <v-container>
    <h1>Config ⚙️ (work in progress)</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <h2>Inscription</h2>
    <v-switch
      label="Ouverture des inscription"
      v-model="config.isSignupOpen"
    ></v-switch>
    <v-text-field
      label="message de fermeture"
      v-model="config.fb_signup_closed"
    ></v-text-field>

    <h2>FA</h2>
    <v-text-field
      label="message de confirmation"
      v-model="config.fb_confirm_submit"
    ></v-text-field>

    <h2>Dispo</h2>
    <v-text-field
      label="charisme max"
      type="number"
      v-model="config.max_charisma"
    ></v-text-field>
    <v-textarea
      label="description des dispo"
      type="number"
      v-model="config.availabilities_description"
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
  name: "config",

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
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },
};
</script>

<style scoped></style>
