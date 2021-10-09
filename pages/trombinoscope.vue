<template>
  <v-container
    style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    "
  >
    <v-card
      v-for="(user, i) in users"
      :key="i"
      style="margin: 5px"
      max-width="250px"
    >
      <v-img
        v-if="user.pp"
        :src="getPPUrl() + 'api/user/pp/' + user.pp"
        max-height="250px"
      ></v-img>
      <v-card-title
        >{{ user.nickname }} ({{ user.firstname }} {{ user.lastname }})
      </v-card-title>
      <v-card-subtitle>
        <OverChips :roles="user.team"></OverChips>
      </v-card-subtitle>
      <v-card-text style="overflow-y: hidden">
        {{ user.comment }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import OverChips from "~/components/atoms/overChips";
export default {
  name: "Trombinoscope",
  components: { OverChips },
  data: () => ({
    users: [],
  }),

  async mounted() {
    this.users = (await this.$axios.get("/user")).data;
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
