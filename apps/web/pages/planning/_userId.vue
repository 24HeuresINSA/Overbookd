<template>
  <div>
    <UserCalendar :user-id="userId" />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import UserCalendar from "~/components/organisms/planning/UserCalendar.vue";

export default Vue.extend({
  name: "Planning",
  components: { UserCalendar, SnackNotificationContainer },
  computed: {
    userId(): number {
      return +this.$route.params.userId;
    },
  },
  async created() {
    if (isNaN(this.userId)) {
      return this.$router.push({ path: "/" });
    }
  },
});
</script>
