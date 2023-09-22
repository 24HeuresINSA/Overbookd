<template>
  <div class="home">
    <h1>Bienvenue sur Overbookd 👋</h1>

    <v-text-field class="search"></v-text-field>

    <SnackNotificationContainer />
  </div>
</template>

<script>
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default Vue.extend({
  name: "Home",
  components: {
    SnackNotificationContainer,
  },
});
</script>

<style lang="scss" scoped>
.home {
  margin: 10px 30px;
  @media only screen and (max-width: $mobile-max-width) {
    margin: 10px;
  }
  display: flex;
  flex-direction: column;
  justify-items: center;
  .search {
    min-width: 80%;
    max-width: 2000px;
    @media only screen and (max-width: $mobile-max-width) {
      min-width: 95%;
    }
  }
}
</style>
