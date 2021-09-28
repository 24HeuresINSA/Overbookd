<template>
  <v-card
    v-if="me"
    height="100%"
    class="d-flex flex-column justify-space-between"
  >
    <div>
      <v-card-title>Le Clicker ⏱</v-card-title>
      <v-card-subtitle>Le compteur de blagues qui dérapent 🚗 </v-card-subtitle>
      <v-container>
        <v-img
          max-height="400px"
          max-width="400px"
          src="https://media.giphy.com/media/WJZbQEoljvfxK/giphy.gif"
        ></v-img>
      </v-container>
      <v-card-text>
        <h2>{{ me.clicks || 0 }} 🚗</h2>
      </v-card-text>
    </div>
    <v-card-actions>
      <v-btn text @click="clicker()">click</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { TMapState } from "~/utils/types/store";
import { UserState } from "~/store/user";
import { dispatch } from "~/utils/store";

export default Vue.extend({
  name: "ClickerCard",
  computed: {
    ...mapState<any, TMapState<UserState>>("user", {
      me: (state) => state.me,
    }),
  },
  methods: {
    clicker: function () {
      const clicks = this.me.clicks ? this.me.clicks + 1 : 1;
      console.log(clicks);
      dispatch(this, "user", "updateUser", {
        userId: this.me.keycloakID,
        userData: { clicks },
      });
    },
  },
});
</script>
