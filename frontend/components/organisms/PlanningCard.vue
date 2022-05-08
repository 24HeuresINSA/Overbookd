<template>
  <v-card>
    <v-card-title>Mon planning </v-card-title>
    <v-card-text>
      <v-btn color="#5fdb48" @click="exportPlanning"
        >Télécharger mon planning</v-btn
      >
      <br />
      <br />
      <p>
        Vous pouvez utiliser ce lien
        <b> {{ DOMAIN }}calendar/{{ me._id }} </b>
        pour le synchroniser avec votre calendrier google.
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";
import planningRepo from "~/repositories/planningRepo";
import { Snack } from "~/utils/models/snack";

export default Vue.extend({
  name: "PlanningCard",
  data() {
    return {
      availabilitiesPath: "/availabilities",
      snack: new Snack(),
      uniquePlanning: undefined,
      DOMAIN: process.env.BASE_URL,
    };
  },
  computed: {
    me() {
      return this.$accessor.user.me;
    },
  },
  methods: {
    async exportPlanning() {
      await planningRepo
        .createPlanning(this, this.me._id)
        .then((res) => {
          if (res) {
            this.uniquePlanning = res.data;
            this.planningLoaded = true;
          } else {
            this.snack.display("Une erreur est survenue");
          }
        })
        .catch(() => {
          this.snack.display("Une erreur est survenue");
        });
      const pdf = this.uniquePlanning;
      window.open(pdf);
    },
  },
});
</script>
