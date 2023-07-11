<template>
  <v-container>
    <h1>Config admin ⚙️</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <PermissionsCard />
    <SnackNotificationContainer />
  </v-container>
</template>

<script>
import PermissionsCard from "~/components/organisms/permission/PermissionsCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default {
  name: "Config",
  components: {
    PermissionsCard,
    SnackNotificationContainer,
  },

  head: () => ({
    title: "Admin",
  }),
};
</script>
