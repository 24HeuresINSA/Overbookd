<template>
  <div>
    <SnackNotification
      v-for="item in queue"
      :key="item.id"
      :set-timeout="item.timeout"
      :set-message="item.message"
      :set-toggle="toggle"
      :set-id="item.id"
    />
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
        true;
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
});
</script>
