<template>
  <v-dialog v-model="isBroadcastDialogOpen" max-width="600">
    <v-card>
      <v-card-title>Envoyer un message a l'asso</v-card-title>
      <v-card-text>
        <v-text-field v-model="notification.link" label="lien"></v-text-field>
        <v-autocomplete
          v-model="notification.team"
          label="team"
          :items="getConfig('teams').map((e) => e.name)"
        ></v-autocomplete>
        <v-text-field
          v-model="notification.message"
          label="message"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="broadcast">📣</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getConfig } from "@/common/role";
export default {
  name: "NotificationBroadcastDialog",
  props: {
    initialIsBroadcastDialogOpen: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      notification: {
        message: "",
        link: "",
        team: "",
      },
      isBroadcastDialogOpen: this.initialIsBroadcastDialogOpen,
    };
  },
  methods: {
    getConfig(key) {
      return getConfig(this, key);
    },
    async broadcast() {
      this.notification.date = new Date();
      this.notification.type = "broadcast";
      await this.$axios.post("/user/broadcast", this.notification);
      //TODO: Use Vuex store there
      this.snackbarMessage = this.SNACKBAR_MESSAGES.broadcasted;
      this.isSnackbarOpen = true;
      this.isBroadcastDialogOpen = false;
    },
  },
};
</script>
