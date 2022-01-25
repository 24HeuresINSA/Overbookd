<template>
  <v-card
    v-if="me"
    height="100%"
    class="d-flex flex-column justify-space-between"
  >
    <div>
      <v-card-title>Le Clicker ⏱</v-card-title>
      <v-card-subtitle>Le compteur de blagues qui dérapent 🚗 </v-card-subtitle>
      <v-img src="https://i.imgur.com/sJWFi5s.gif"></v-img>
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

export default Vue.extend({
  name: "ClickerCard",
  computed: {
    me() {
      return this.$accessor.user.me;
    },
  },
  methods: {
    clicker: function () {
      const clicks = this.me.clicks ? this.me.clicks + 1 : 1;
      this.$accessor.user.updateUser({
        userID: this.me._id,
        userData: { clicks },
      });
    },
  },
});
</script>
