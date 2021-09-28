<template>
  <v-dialog v-model="toggled" :retain-focus="false" max-width="600">
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

<script lang="ts">
import Vue from "vue";
import { getConfig } from "@/common/role";
import { mapState } from "vuex";
import { DialogState } from "~/store/dialog";
import { TMapState } from "~/utils/types/store";
import { RepoFactory } from "~/repositories/repoFactory";
import { BroadcastNotif } from "~/utils/models/repo";
import { SnackNotif } from "~/utils/models/store";

export default Vue.extend({
  name: "NotificationBroadcastDialog",
  data() {
    return {
      notification: new BroadcastNotif(),
    };
  },
  computed: {
    ...mapState<any, TMapState<DialogState>>("dialog", {
      type: (state: DialogState) => state.type,
      open: (state: DialogState) => state.open,
    }),
    toggled: {
      get: function (): boolean | unknown {
        if (this.type == "broadcast") {
          return this.open;
        }
        if (!this.open) {
          return false;
        }
        return false;
      },
      set(val): void {
        if (!val) {
          this.$store.dispatch("dialog/closeDialog");
        }
      },
    },
  },
  methods: {
    getConfig(key: string): string {
      return getConfig(this, key);
    },
    async broadcast(): Promise<void> {
      this.toggled = false;
      this.notification.type = "broadcast";
      this.notification.date = new Date();
      //TODO: Put this in generic post method
      try {
        // broadcast on server
        let res = await RepoFactory.get("user").broadcast(
          this,
          this.notification
        );
        if (res.status !== 200) {
          throw new Error("Server did not return 200 status");
        }
        let notif: SnackNotif = {
          type: "success",
          message: "Sent !",
        };
        this.$store.dispatch("notif/pushNotification", notif);
      } catch (error: any) {
        let notif: SnackNotif = {
          type: "error",
          message: "Could not broadcast",
        };
        this.$store.dispatch("notif/pushNotification", notif);
      }
    },
  },
});
</script>
