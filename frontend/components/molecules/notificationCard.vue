<template>
  <v-data-table
    v-if="me.notifications"
    :items="me.notifications"
    :headers="headers"
    style="overflow-y: scroll; max-height: 300px"
    hide-default-footer
    hide-default-header
  >
    <template #[`item.team`]="item">
      <OverChips :roles="[item.item.team]"></OverChips>
    </template>
    <template #[`item.icon`]="item">
      {{ item.item.type === "friendRequest" ? "👨‍👩‍👧" : "📣" }}
    </template>
    <template #[`item.action`]="notification">
      <div v-if="notification.item.type === 'friendRequest'">
        <v-btn icon @click="acceptFriendRequest(notification.item)">
          <v-icon>mdi-account-check</v-icon>
        </v-btn>
        <v-btn icon @click="refuseFriendRequest(notification.item)">
          <v-icon>mdi-account-cancel</v-icon>
        </v-btn>
      </div>
      <div v-else-if="notification.item.type === 'broadcast'">
        <v-btn
          v-if="notification.item.link"
          icon
          @click="openLink(notification.item.link)"
        >
          <v-icon>mdi-link</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import OverChips from "@/components/atoms/overChips.vue";
import { Notification, User } from "~/utils/models/repo";
import { SnackNotif } from "../../utils/models/store";

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

      // table
      headers: [
        { text: "", value: "icon" },
        { text: "depuis", value: "team" },
        {
          text: "message",
          value: "message",
        },
        { text: "action", value: "action" },
      ],
    };
  },
  computed: {
    me(): User {
      return this.$accessor.user.me;
    },
  },
  methods: {
    openLink(link: string) {
      window.open(link);
    },

    popNotification(index: number): Notification[] {
      let notifs = this.me.notifications;
      notifs.splice(index);
      return notifs;
    },

    async acceptFriendRequest(notification: any): Promise<void> {
      if (notification.data) {
        //TODO: RepoFactory + safeCall
        await this.$axios
          .post(`/user/friends`, {
            from: this.me._id,
            to: notification.data,
          })
          .then(() => {
            const notif: SnackNotif = {
              type: "success",
              message: "Ami ajouté !",
            };
            this.$store.dispatch("notif/pushNotification", notif);
          });
        this.deleteNotification(notification.date);
      }
    },

    async refuseFriendRequest(notification: any): Promise<void> {
      if (notification.data) {
        this.deleteNotification(notification.date);
      }
    },
    deleteNotification(date: Date): void {
      const notifications = this.me.notifications.filter(
        (item) => item.date != date
      );
      this.$accessor.user.updateUser({
        userID: this.me._id,
        userData: { notifications },
      });
      const notif: SnackNotif = {
        type: "success",
        message: "Demande refusée !",
      };
      this.$store.dispatch("notif/pushNotification", notif);
    },
  },
});
</script>
