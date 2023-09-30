<template>
  <div class="notifications">
    <h1>Notifications</h1>
    <v-card to="/registrations">
      <v-btn class="ignore-btn" icon @click="ignore">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <span class="bullet"> </span>
      <v-card-title>Inscriptions</v-card-title>
      <v-card-subtitle>Nouveaux arrivants</v-card-subtitle>
      <v-card-text>
        Un ou plusieurs nouveaux arrivants attendent que tu valides leur
        inscription
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Notifications",
  methods: {
    ignore(event: Event): void {
      event.preventDefault();
      console.warn("Ignore notification");
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  padding-left: 10px;
}

.ignore-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}

.bullet {
  position: absolute;
  top: 3px;
  left: 3px;

  border-radius: 50%;
  background-color: $blue-24h;
  @media only screen and (max-width: $mobile-max-width) {
    min-width: 15px;
    min-height: 15px;
  }
  min-width: 10px;
  min-height: 10px;
}
</style>
