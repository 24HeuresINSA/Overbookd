<template>
  <div class="profile">
    <h1>Profil</h1>
    <UserCard />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import UserCard from "~/components/organisms/user/UserCard.vue";

export default Vue.extend({
  name: "Profile",
  components: {
    UserCard,
    SnackNotificationContainer,
  },
});
</script>

<style lang="scss" scoped>
h1 {
  padding-left: 10px;
}
</style>
