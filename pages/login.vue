<template>
  <v-form>
    <v-container>
      <v-row>
        <v-text-field
          v-model="credentials.username"
          label="username"
          type="text"
          required
          autofocus
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          v-model="credentials.password"
          label="password"
          type="password"
          required
        ></v-text-field>
      </v-row>
    </v-container>
    <v-btn color="primary" elevation="2" href="/signup">signup</v-btn>
    <v-btn color="secondary" elevation="2" @click="login()">login</v-btn>
  </v-form>
</template>

<script>
export default {
  name: "login",
  auth: false,
  data: () => ({
    credentials: {
      username: undefined,
      password: undefined,
    },
    error: "",
    valid: false,
    toast: {
      snackbar: false,
      timeout: 2000,
    },
  }),

  async beforeCreate() {
    console.log("this.$auth.loggedIn", this.$auth.loggedIn);
    if (this.$auth.loggedIn) {
      console.log("redirecting...");
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    login: async function () {
      try {
        await this.$auth.loginWith("keycloak", this.credentials); // try to log user in
        await this.$router.push({
          path: "/", // TODO change this to eventSelector page
        }); // redirect to homepage
      } catch (e) {
        console.log("an error has occurred");
        console.error(e);
      }
    },
  },
};
</script>

<style scoped></style>
