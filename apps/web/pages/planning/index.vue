<template>
  <div>
    <UserCalendar :user="me" />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MyUserInformation } from "@overbookd/user";
import UserCalendar from "~/components/organisms/planning/UserCalendar.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default defineComponent({
  name: "Planning",
  components: { UserCalendar, SnackNotificationContainer },
  computed: {
    userId(): number {
      return this.$accessor.user.me.id;
    },
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
  },
});
</script>
