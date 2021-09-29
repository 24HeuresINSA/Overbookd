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
import Vue from "vue";
import { getUser } from "@/common/role";
import OverChips from "@/components/atoms/overChips.vue";
import { Notification, User } from "~/utils/models/repo";

export default Vue.extend({
  name: "NotificationCard",
  components: { OverChips },
  props: {
    notif: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      notification: this.notif,
    };
  },
  methods: {
    popNotification(index: number): Notification[] {
      let user = getUser(this);
      (user as User).notifications.splice(index);
      let notifs = (user as User).notifications;
      return notifs;
    },
    //TODO
    async acceptFriendRequest(notification: any): Promise<void> {
      if (notification.data) {
        let user = getUser(this);
        //! TERRIBLE
        // user.notifications.pop();
        await this.$axios.post(`/user/friends`, {
          from: user._id,
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
        let friends;
        let user = getUser(this);
        if (user.friends === undefined) {
          friends = [];
        } else {
          friends = user.friends;
        }
        //! TERRIBLE
        // user.notifications.pop();
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
      let { notifications, keycloakID: userId } = getUser(this);
      const notifs = notifications.filter((_: any, i: number) => i != index);
      this.$store.dispatch("user/updateUser", {
        userId,
        userData: { notifications: notifs },
      });
    },
  },
});
</script>
