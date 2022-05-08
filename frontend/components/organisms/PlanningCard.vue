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
      <p>
        Pour ajouter le calendrier, rendez-vous sur votre ordinateur puis
        <a
          href="https://calendar.google.com/calendar/u/0/r/settings/addbyurl"
          target="_blanck"
        >
          sur ce lien</a
        >
        (Google calendar sur votre navigateur web avec l'ajout d'un calendrier
        par url).
        <br />
        Et coller le lien ci-dessus dans le champ "URL de l'aganda". Cliquez sur
        "ajouter l'agenda". Vos créneaux overbookd sont maintenant dans votre
        calendrier google.
      </p>
      <p>
        Pour le voir sur votre téléphone, dans l'application google calendar,
        allez dans le menu à gauche, puis dans paramètre. Sous votre adresse
        mail, vous pouvez séléctionnez le calendrier ajouter depuis votre
        ordinateur et l'afficher.
      </p>
      <p>
        Si vous avez des problèmes, reportez-vous à
        <a
          href="https://support.google.com/calendar/answer/37100?hl=en&co=GENIE.Platform%3DDesktop&oco=1#zippy="
          target="_blanck"
        >
          l'aide de google</a
        >, section "Use a link to add a public calendar" pour la partie ajout
        d'un calendrier. Et dans "Android" ou "iPhone & iPad" pour votre mobile.
      </p></v-card-text
    >
  </v-card>
</template>

<script>
import Vue from "vue";
import planningRepo from "~/repositories/planningRepo";

export default Vue.extend({
  name: "PlanningCard",
  data() {
    return {
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
            window.open(res.data);
          } else {
            this.$accessor.notif.pushNotification({
              type: "error",
              message: "Une erreur est survenue",
            });
            return;
          }
        })
        .catch(() => {
          this.$accessor.notif.pushNotification({
            type: "error",
            message: "Une erreur est survenue",
          });
          return;
        });
    },
  },
});
</script>
