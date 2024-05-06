<template>
  <div>
    <UserCalendar v-if="selectedUser?.id" :user="selectedUser" />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UserPersonalData } from "@overbookd/user";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import UserCalendar from "~/components/organisms/planning/UserCalendar.vue";

export default defineComponent({
  name: "Planning",
  components: { UserCalendar, SnackNotificationContainer },
  computed: {
    userId(): number {
      return +this.$route.params.userId;
    },
    selectedUser(): UserPersonalData {
      return this.$accessor.user.selectedUser;
    },
  },
  async created() {
    if (isNaN(this.userId)) {
      return this.$router.push({ path: "/" });
    }
    await this.$accessor.user.findUserById(this.userId);
  },
});
</script>
