<template>
  <tr>
    <td>
      {{ notification.type === "friendRequest" ? "👨‍👩‍👧" : "📣" }}
    </td>
    <td>
      <OverChips :roles="notification.team"></OverChips>
    </td>
    <td>{{ notification.message }}</td>
    <td v-if="notification.type === 'friendRequest'">
      <v-btn icon @click="acceptFriendRequest(notification)">
        <v-icon>mdi-account-check</v-icon>
      </v-btn>
      <v-btn icon @click="refuseFriendRequest(notification)">
        <v-icon>mdi-account-cancel</v-icon>
      </v-btn>
    </td>
    <td v-else-if="notification.type === 'broadcast'">
      <v-btn icon :href="notification.link">
        <v-icon>mdi-link</v-icon>
      </v-btn>
      <v-btn icon @click="deleteNotification(notification.index)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import OverChips from "@/components/atoms/overChips.vue";
import { Notification, User } from "~/utils/models/repo";

export default Vue.extend({
  name: "NotificationCard",
  components: { OverChips },
  props: {
    notif: {
      //TODO Add index to the notification basic interface + in database
      type: Object as PropType<Notification & { index: number }>,
      required: true,
    },
  },
  data() {
    return {
      notification: this.notif,
    };
  },
  computed: {
    me(): User {
      return this.$accessor.user.me;
    },
  },
  methods: {
    popNotification(index: number): Notification[] {
      let notifs = this.me.notifications;
      notifs.splice(index);
      return notifs;
    },
    //TODO
    async acceptFriendRequest(notification: any): Promise<void> {
      if (notification.data) {
        //TODO: RepoFactory + safeCall
        await this.$axios.post(`/user/friends`, {
          from: this.me._id,
          to: notification.data,
        });
        this.deleteNotification(this.notif.index);
        // this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.accepted;
        // this.isSnackbarOpen = true;
      } else {
        // this.snackbarMessage = this.SNACKBAR_MESSAGES.error;
        // this.isSnackbarOpen = true;
      }
    },

    //TODO
    async refuseFriendRequest(notification: any): Promise<void> {
      if (notification.data) {
        let friends = [];
        if (this.me.friends) {
          friends = this.me.friends;
        }
        //TODO Something happen on refusal ?
        // await this.$axios.put(`/user/${user.keycloakID}`, user);
        this.deleteNotification(this.notif.index);
        // this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.accepted;
        // this.isSnackbarOpen = true;
      } else {
        // this.snackbarMessage = this.SNACKBAR_MESSAGES.error;
        // this.isSnackbarOpen = true;
      }
    },
    deleteNotification(index: number): void {
      const notifications = this.me.notifications.filter((_, i) => i != index);
      this.$accessor.user.updateUser({
        userId: this.me.keycloakID,
        userData: { notifications },
      });
    },
  },
});
</script>
