<template>
  <v-container style="display: flex; flex-wrap: wrap">
    <v-card
      v-for="(user, i) in users"
      :key="i"
      style="margin: 5px"
      max-width="250px"
    >
      <v-img
        v-if="user.pp"
        :src="getPPUrl() + 'api/user/pp/' + user.pp"
        max-width="300px"
        max-height="500px"
      ></v-img>
      <v-card-title
        >{{
          user.nickname
            ? user.nickname
            : `${user.firstname} ${user.lastname.toUpperCase()} `
        }}
      </v-card-title>
      <v-card-subtitle>
        <OverChips :roles="user.team"></OverChips>
      </v-card-subtitle>
      <v-card-text>
        {{ user.comment }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import OverChips from "../components/overChips";
export default {
  name: "Trombinoscope",
  components: { OverChips },
  data: () => ({
    users: [],
  }),

  async mounted() {
    this.users = (await this.$axios.get("/user")).data;
    console.log(this.users);
  },

  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },
  },
};
</script>

<style scoped></style>
