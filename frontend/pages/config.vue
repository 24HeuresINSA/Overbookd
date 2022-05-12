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
      label="Message de fermeture"
    ></v-text-field>

    <h2>Humains</h2>
    <h3>FA</h3>
    <v-text-field
      v-model="config.fb_confirm_submit"
      label="Message de confirmation"
    />

    <h3>Affectation</h3>
    <v-switch
      v-model="config.show_ft_in_planning"
      label="Montrer les FTs dans les plannings"
    />

    <v-switch
      v-model="config.availabilityMoment"
      label="Télécharger les plannings | Demander les dispos"
    />

    <h2>Dispo</h2>
    <v-text-field
      v-model="config.max_charisma"
      label="Charisme max"
      type="number"
    ></v-text-field>
    <v-textarea
      v-model="config.availabilities_description"
      label="Description des dispo"
      type="number"
    ></v-textarea>
    <h2>Log</h2>
    <v-switch
      v-model="config.isInventoryOpen"
      label="Ouvrir l'édition de l'inventaire au hard"
    ></v-switch>

    <v-dialog v-model="dialog" width="auto " @keydown.esc="cancel">
      <template #activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Enregistrer
        </v-btn>
      </template>

      <v-card>
        <v-card-title> Confirmation </v-card-title>
        <v-card-text>
          Appui sur "confirmer" pour valider tes changements de configurations
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            :loading="load"
            @click="submitConfigChanges"
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      color="primary"
      :timeout="timeout"
      width="auto "
    >
      Configurations envoyées au serveur !
    </v-snackbar>
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
        show_ft_in_planning: getConfig(this, "show_ft_in_planning"),
        availabilityMoment: getConfig(this, "availabilityMoment"),
      },
      dialog: false,
      load: false,
      timeout: 2000,
      snackbar: false,
    };
  },

  async mounted() {
    if (this.$accessor.user.hasRole(this, ["admin", "bureau"])) {
      //TODO: Invert this to avoid empty if
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    async submitConfigChanges() {
      this.load = true;
      const data = [];
      for (const model in this.config) {
        const tmp = {};
        tmp["value"] = this.config[model];
        tmp["key"] = model;
        data.push(tmp);
      }
      try {
        await this.$axios.put("/config", data);
        this.load = false;
        this.dialog = false;
        this.snackbar = true;
      } catch (e) {
        alert("There was a problem !");
      }
    },
  },
};
</script>

<style scoped></style>
