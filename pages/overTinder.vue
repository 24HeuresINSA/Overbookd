<template>
  <v-container>
    <h1>OverTinder 🔥</h1>
    <v-btn text @click="openCP">Telecharger un constat de choppe</v-btn>
    <br />
    <v-card v-if="user" max-width="400">
      <v-img
        v-if="user.pp"
        :src="getPPUrl() + 'api/user/pp/' + user.pp"
      ></v-img>
      <v-card-title>
        {{ user.nickname ? user.nickname : user.firstname }}
      </v-card-title>
      <v-card-text>
        <p>Charisme: {{ user.charisma }}</p>
      </v-card-text>
      <v-card-actions style="display: flex; justify-content: space-between">
        <v-btn elevation="5" fab icon color="green" @click="next()"
          ><v-icon>mdi-check</v-icon></v-btn
        >
        <v-btn elevation="5" fab icon color="red" @click="next(true)"
          ><v-icon>mdi-cancel</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "OverTinder",

  data() {
    return {
      users: [],
      user: {
        nickname: undefined,
        charisma: 0,
        isCouple: undefined,
        sex: undefined,
      },
    };
  },

  async mounted() {
    this.users = (await this.$axios("/user")).data;
    this.users.filter((u) => u.pp);
    this.next();
    this.user = this.users[0];
  },

  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },

    openCP() {
      window.open("Constat-Choppe.pdf");
    },

    next(isLeft) {
      this.user = this.users[Math.floor(Math.random() * this.users.length)];
    },
  },
};
</script>

<style scoped></style>
