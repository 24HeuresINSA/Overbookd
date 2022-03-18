<template>
  <v-container>
    <h1>OverTinder 🔥</h1>
    <v-btn text @click="openCP">Télécharger un constat de choppe</v-btn>
    <br />
    <div style="display: flex; width: 100%; justify-content: center">
      <v-card v-if="user" max-width="400" elevation="5">
        <v-img
          v-if="user.pp"
          :src="getPPUrl() + 'api/user/pp/' + user.pp"
        ></v-img>
        <v-card-title>
          {{ user.nickname ? user.nickname : user.firstname }}
        </v-card-title>
        <v-card-text>
          <p>Charisme: {{ user.charisma }}</p>
          <p>{{ user.comment }}</p>
          <v-progress-linear
            :value="(user.charisma / maxCharisma) * 100"
          ></v-progress-linear>
        </v-card-text>
        <v-card-actions style="display: flex; justify-content: space-between">
          <v-btn elevation="5" fab icon color="green" @click="next()">
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-tab v-if="isBG(user)" text @click="next(true)">SUPER LIKE</v-tab>
          <v-btn
            v-if="!isBG(user)"
            elevation="5"
            fab
            icon
            color="red"
            @click="next(true)"
          >
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
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
      maxCharisma: 1500,
    };
  },

  async mounted() {
    this.maxCharisma = this.$accessor.config.getConfig("max_charisma");
    this.users = (await this.$axios("/user")).data;
    this.users = this.users.filter(({ pp }) => pp !== undefined);
    this.user = this.users[0];
    this.next();
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

    isBG(user) {
      if (user && user.firstname && user.lastname) {
        return (
          user.firstname === "Hamza" ||
          user.lastname.toLowerCase() === "badaoui"
        );
      }
      return false;
    },

    next(isLeft) {
      this.user = this.users[Math.floor(Math.random() * this.users.length)];
    },
  },
};
</script>

<style scoped></style>
