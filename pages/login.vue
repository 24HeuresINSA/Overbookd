<template>
  <v-form>
    <v-container class="form-container">
      <v-row>
        <v-img :src="overbookd_logo" alt="overbookd logo" class="logo"></v-img>
      </v-row>
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
    <v-btn color="secondary" elevation="2" href="/signup" class="signupBtn Btn"
      >signup</v-btn
    >
    <v-btn color="primary" elevation="2" @click="login()" class="loginBtn Btn"
      >login</v-btn
    >
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
  }),

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

  computed: {
    overbookd_logo: function () {
      return this.$vuetify.theme.dark
        ? "overbookd_logo_blanc.png"
        : "overbookd_logo_noir.png";
    },
  },
};
</script>

<style scoped lang="scss">
.logo {
  margin-bottom: 10%;
}
.form-container {
  align-self: center;
  justify-self: center;
  margin-top: 20%;
  width: 75%;
}

.Btn {
  position: absolute;
  bottom: 20px;
}

.loginBtn {
  right: 20px;
}
.signupBtn {
  left: 20px;
}
</style>
