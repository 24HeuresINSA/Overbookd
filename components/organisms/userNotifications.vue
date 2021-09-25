<template>
  <v-card v-if="theUser">
    <v-card-title>Notifications 📣️</v-card-title>
    <v-card-text v-if="theUser.notifications">
      <v-simple-table>
        <template #default>
          <thead>
            <tr>
              <th class="text-left"></th>
              <th class="text-left">Team</th>
              <th class="text-left">Message</th>
              <th class="text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <NotificationCard
              v-for="(notif, index) in theUser.notifications"
              :key="index"
              :notif="notif"
            />
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>

    <template v-if="hasRole(['admin', 'bureau'])">
      <v-card-title>{{ notValidatedCount }} Orgas non validés </v-card-title>
    </template>

    <v-card-actions>
      <v-btn v-if="hasRole('hard')" text @click="isBroadcastDialogOpen = true"
        >broadcast
      </v-btn>
      <v-btn v-if="hasRole(['admin', 'bureau'])" text to="/humans"
        >Liste des Orgas
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { hasRole } from "@/common/role";
import NotificationCard from "~/components/molecules/notificationCard.vue";
export default {
  name: "UserNotifications",
  components: { NotificationCard },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          notifications: [
            {
              link: "wikipedia.fr",
              message: "Daaaamn",
              team: "bureau",
              date: "2021-09-24T13:29:38.137Z",
              type: "broadcast",
            },
          ],
        };
      },
    },
  },
  data() {
    return {
      theUser: this.user,
    };
  },
  methods: {
    hasRole(team) {
      return hasRole(this, team);
    },
  },
};
</script>
