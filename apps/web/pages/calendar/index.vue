<template>
  <UserCalendar :user-id="userId" />
</template>

<script lang="ts">
import Vue from "vue";
import UserCalendar from "~/components/organisms/planning/UserCalendar.vue";

export default Vue.extend({
  name: "Calendar",
  components: { UserCalendar },
  computed: {
    userId() {
      return this.$accessor.user.me.id;
    },
  },
  async created() {
    if (!this.$accessor.user.hasPermission("hard")) {
      return this.$router.push({ path: "/" });
    }
  },
});
</script>
