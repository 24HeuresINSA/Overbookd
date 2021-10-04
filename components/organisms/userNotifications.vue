<template>
  <div style="height: 100%">
    <NotificationBroadcastDialog />
    <v-card
      v-if="me"
      height="100%"
      class="d-flex flex-column justify-space-between"
    >
      <div>
        <v-card-title>Notifications 📣️</v-card-title>
        <v-card-text v-if="me.notifications">
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
                  v-for="(notif, index) in me.notifications"
                  :key="index"
                  :notif="{ ...notif, index }"
                />
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <template v-if="IhaveRole(['admin', 'bureau'])">
          <v-card-text>{{ notValidatedCount }} Orgas non validés </v-card-text>
        </template>
      </div>

      <v-card-actions
        class="
          d-flex
          justify-space-between
          align-start align-sm-end
          flex-column flex-sm-row
        "
      >
        <v-btn v-if="IhaveRole('hard')" text @click="openBroadcastDialog()"
          >broadcast
        </v-btn>
        <v-btn
          v-if="IhaveRole(['admin', 'bureau'])"
          text
          to="/humans"
          class="ml-0"
          >Liste des Orgas
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { hasRole } from "~/utils/roles";
import NotificationCard from "~/components/molecules/notificationCard.vue";
import NotificationBroadcastDialog from "~/components/molecules/notificationBroadcastDialog.vue";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { mapState } from "vuex";
import { TMapState } from "~/utils/types/store";
import { UserState } from "~/store/user";
import { User } from "~/utils/models/repo";

export default Vue.extend({
  name: "UserNotifications",
  components: { NotificationCard, NotificationBroadcastDialog },
  data() {
    return {
      notValidatedCount: 0,
    };
  },
  computed: {
    ...mapState<any, TMapState<UserState>>("user", {
      me: (state) => state.me,
    }),
  },
  async mounted() {
    this.notValidatedCount = await this.getNotValidatedCount();
  },
  methods: {
    IhaveRole(roles: string[] | string) {
      return hasRole(this.me, roles);
    },
    async getNotValidatedCount() {
      const res = await safeCall(
        this.$store,
        RepoFactory.userRepo.getAllUsers(this)
      );
      if (res) {
        const users: User[] = res.data;
        return users.filter((user: User) => user.team.length === 0).length;
      }
      return 0;
    },
    openBroadcastDialog() {
      this.$store.dispatch("dialog/openDialog", "broadcast");
    },
  },
});
</script>
