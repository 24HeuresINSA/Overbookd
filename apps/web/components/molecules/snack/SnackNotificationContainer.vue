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
import SnackNotification from "~/components/atoms/snack/SnackNotification.vue";
import { SnackNotif } from "~/utils/notification/snack";

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
  computed: {
    queue(): SnackNotif[] {
      return this.$accessor.notif.queue;
    },
  },
});
</script>
