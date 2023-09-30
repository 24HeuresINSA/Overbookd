<template>
  <div class="notifications">
    <h1>Notifications</h1>
    <v-card v-if="hasNotifications" class="notification" @click="move">
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
    <p v-else>Rien de nouveau pour le moment !</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Notifications",
  computed: {
    hasNotifications(): boolean {
      return this.$accessor.notification.hasNotifications;
    },
  },
  methods: {
    ignore(event: Event): void {
      event.preventDefault();
      this.dismiss();
    },
    async move(): Promise<void> {
      this.$router.push("/registrations");
      this.dismiss();
    },
    dismiss(): void {
      this.$accessor.notification.readNotification();
    },
  },
});
</script>

<style lang="scss" scoped>
.notification {
  &:hover {
    cursor: pointer;
  }
}

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
  border-radius: 50%;
  background-color: $blue-24h;
  top: 8px;
  left: 8px;
  min-width: 10px;
  min-height: 10px;
  @media only screen and (max-width: $mobile-max-width) {
    top: 3px;
    left: 3px;
    min-width: 15px;
    min-height: 15px;
  }
}
</style>
