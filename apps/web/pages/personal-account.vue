<template>
  <div>
    <h1>Mon compte personnel</h1>
    <div class="personal-account">
      <div class="personal-account__balance"></div>
      <div class="personal-account__transactions"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MyUserInformation } from "@overbookd/user";

export default Vue.extend({
  name: "PersonalAccount",
  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
  },
});
</script>

<style lang="scss" scoped>
.personal-account {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &__balance,
  &__transactions {
    width: 50%;
    height: 100%;
  }

  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;

    &__balance,
    &__transactions {
      width: 100%;
    }
  }
}
</style>
