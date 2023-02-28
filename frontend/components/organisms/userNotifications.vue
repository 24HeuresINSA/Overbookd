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
          <NotificationCard :notif="{ ...me.notifications }" />
        </v-card-text>
        <template v-if="hasPermission('affect-team')">
          <v-card-text>{{ notValidatedCount }} orgas non validés </v-card-text>
        </template>
      </div>

      <v-card-actions
        class="d-flex justify-space-between align-start align-sm-end flex-column flex-sm-row"
      >
        <v-btn
          v-if="hasPermission('send-broadcast')"
          text
          @click="openBroadcastDialog()"
          >broadcast
        </v-btn>
        <v-btn v-if="hasPermission('hard')" text to="/humans" class="ml-0">
          Liste des Orgas
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import NotificationBroadcastDialog from "~/components/molecules/notifications/NotificationBroadcastDialog.vue";
import NotificationCard from "~/components/molecules/notifications/NotificationCard.vue";
import { RepoFactory } from "~/repositories/repoFactory";
import { UserState } from "~/store/user";
import { safeCall } from "~/utils/api/calls";
import { User } from "~/utils/models/repo";
import { TMapState } from "~/utils/types/store";

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
    if (!this.hasPermission("affect-team")) return;
    this.notValidatedCount = await this.getNotValidatedCount();
  },
  methods: {
    hasPermission(permission: string) {
      return this.$accessor.user.hasPermission(permission);
    },
    async getNotValidatedCount() {
      const res = await safeCall(
        this.$store,
        RepoFactory.userRepo.getAllUsers(this)
      );
      if (res) {
        const users: User[] = res.data;
        return users.filter(
          (user: User) => !this.$accessor.permission.isValidated(user)
        ).length;
      }
      return 0;
    },
    openBroadcastDialog() {
      this.$store.dispatch("dialog/openDialog", "broadcast");
    },
  },
});
</script>
