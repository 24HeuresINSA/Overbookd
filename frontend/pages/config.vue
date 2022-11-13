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
export default {
  name: "Config",

  data() {
    return {
      config: {
        isSignupOpen: undefined,
        fb_signup_closed: undefined,
        fb_confirm_submit: undefined,
        availabilities_description: undefined,
        max_charisma: undefined,
        isInventoryOpen: undefined,
        show_ft_in_planning: undefined,
        availabilityMoment: undefined,
      },
      dialog: false,
      load: false,
      timeout: 2000,
      snackbar: false,
    };
  },

  async mounted() {
    if (
      this.$accessor.permission.isAllowed(
        "config-write",
        this.$accessor.user.me.team
      )
    ) {
      this.config.isSignupOpen =
        this.$accessor.config.getConfig("isSignupOpen");
      this.config.fb_signup_closed =
        this.$accessor.config.getConfig("fb_signup_closed");
      this.config.fb_confirm_submit =
        this.$accessor.config.getConfig("fb_confirm_submit");
      this.config.availabilities_description = this.$accessor.config.getConfig(
        "availabilities_description"
      );
      this.config.max_charisma =
        this.$accessor.config.getConfig("max_charisma");
      this.config.isInventoryOpen =
        this.$accessor.config.getConfig("isInventoryOpen");
      this.config.show_ft_in_planning = this.$accessor.config.getConfig(
        "show_ft_in_planning"
      );
      this.config.availabilityMoment =
        this.$accessor.config.getConfig("availabilityMoment");
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
