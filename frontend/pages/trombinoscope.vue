<template>
  <div>
    <v-container
      v-if="userBornToday"
      style="display: flex; justify-content: center"
    >
      <v-card
        color="#FFD700"
        style="margin: 20px"
        max-width="400px"
        max-height="400px"
      >
        <v-img
          v-if="userBornToday.pp"
          :src="getPPUrl() + 'api/user/pp/' + userBornToday.pp"
          max-width="400px"
          max-height="350px"
        ></v-img>
        <v-card-title>
          Joyeux annif 🥳 {{ userBornToday.nickname }} ({{
            userBornToday.firstname
          }}
          {{ userBornToday.lastname }})
        </v-card-title>
      </v-card>
    </v-container>
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
  </div>
</template>

<script>
import OverChips from "~/components/atoms/overChips";
export default {
  name: "Trombinoscope",
  components: { OverChips },
  data: () => ({
    users: [],
    userBornToday: undefined,
  }),

  async mounted() {
    if (this.$accessor.user.hasRole("hard")) {
      this.users = (await this.$axios.get("/user")).data;
      this.userBornToday = this.users.find((user) => {
        if (user.birthdate) {
          const birthday = new Date(user.birthdate);
          return this.isToday(birthday);
        }
      });
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    isToday(someDate) {
      const today = new Date();
      return (
        someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth()
      );
    },
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },
  },
};
</script>

<style scoped></style>
