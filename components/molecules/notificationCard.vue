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
      <v-btn icon @click="deleteNotification(index)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </td>
  </tr>
</template>

<script>
import { getUser } from "@/common/role";
import OverChips from "@/components/atoms/overChips.vue";
export default {
  name: "NotificationCard",
  components: { OverChips },
  props: {
    notif: {
      type: Object,
      default: () => {
        return {
          link: "wikipedia.fr",
          message: "Daaaamn",
          team: "bureau",
          date: "2021-09-24T13:29:38.137Z",
          type: "broadcast",
        };
      },
    },
  },
  data() {
    return {
      notification: this.notif,
    };
  },
  methods: {
    async acceptFriendRequest(notification) {
      if (notification.data) {
        let user = getUser(this);
        user.notifications.pop();
        await this.$axios.post(`/user/friends`, {
          from: user._id,
          to: notification.data,
        });
        this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.accepted;
        this.isSnackbarOpen = true;
      } else {
        this.snackbarMessage = this.SNACKBAR_MESSAGES.error;
        this.isSnackbarOpen = true;
      }
    },

    async refuseFriendRequest(notification) {
      if (notification.data) {
        let friends;
        let user = getUser(this);
        if (user.friends === undefined) {
          friends = [];
        } else {
          friends = user.friends;
        }
        user.notifications.pop();
        await this.$axios.put(`/user/${user.keycloakID}`, user);
        this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.accepted;
        this.isSnackbarOpen = true;
      } else {
        this.snackbarMessage = this.SNACKBAR_MESSAGES.error;
        this.isSnackbarOpen = true;
      }
    },
  },
};
</script>
