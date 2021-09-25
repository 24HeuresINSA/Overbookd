<template>
  <div>
    <SnackNotification
      v-for="item in queue"
      :key="item.id"
      :set-timeout="item.timeout"
      :set-message="item.message + item.id"
      :set-toggle="toggle"
      :set-id="item.id"
    />
    <v-btn @click="addNotif">Push notification</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import SnackNotification from "@/components/atoms/snackNotification.vue";
import { NotificationState } from "~/store/notif";
import { TMapState } from "~/utils/types/store";
export default Vue.extend({
  name: "SnackNotificationContainer",
  components: { SnackNotification },
  props: {
    toggle: {
      type: Boolean,
      default: () => {
        false;
      },
    },
  },
  data() {
    return {
      message: "Hello",
      timeout: 1000,
    };
  },
  computed: {
    ...mapState<any, TMapState<NotificationState>>("notif", {
      queue: (state: NotificationState) => state.queue,
    }),
  },
  methods: {
    addNotif: function () {
      this.$store.dispatch("notif/pushNotification", {
        type: "error",
        message: "Han naaan",
        timeout: 3000,
      });
    },
  },
});
</script>
