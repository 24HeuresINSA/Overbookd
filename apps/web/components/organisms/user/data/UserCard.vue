<template>
  <div>
    <ProfilePictureDialog />
    <v-card v-if="me">
      <v-container class="d-flex flex-no-wrap">
        <ProfilePicture :user="me" class="profilePicture" />
        <div>
          <v-card-title class="pt-2">
            Bonsoir
            {{ me.nickname ? me.nickname : me.firstname }} 👋
          </v-card-title>
          <v-card-subtitle>
            {{ me.firstname }} {{ me.lastname }}
          </v-card-subtitle>
        </div>
      </v-container>
      <v-card-actions class="d-flex justify-start">
        <v-btn text max-width="300px" @click="openProfilePictureDialog()"
          >📸
          {{ me.profilePicture ? `Mettre à jour` : `Ajouter` }}
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <h3 class="mt-1">📩 {{ me.email }}</h3>
        <h3 class="mt-1">📞 +33 {{ me.phone }}</h3>
        <h3 class="mt-1">😎 {{ me.charisma || 0 }} points de charisme</h3>
        <h3 class="mt-1">❤️ {{ friends }} amis</h3>
        <h3 class="mt-1">
          📆 {{ new Date(me.birthdate).toLocaleDateString() }}
        </h3>
        <h3 class="mt-1">🗣 {{ me.tasksCount }} tâches affectées</h3>

        <OverChips :roles="me.teams"></OverChips>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverChips from "~/components/atoms/chip/OverChips.vue";
import ProfilePictureDialog from "~/components/molecules/user/ProfilePictureDialog.vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import { MyUserInformation } from "@overbookd/user";

export default Vue.extend({
  name: "UserCard",
  components: { OverChips, ProfilePictureDialog, ProfilePicture },
  props: {
    user: {
      type: Object,
      default: () => {
        undefined;
      },
    },
  },

  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    friends(): number {
      return this.$accessor.user.mFriends.length;
    },
  },

  mounted() {
    if (!this.me.profilePicture) return;
    this.$accessor.user.setMyProfilePicture();
  },

  methods: {
    openProfilePictureDialog() {
      this.$store.dispatch("dialog/openDialog", "profilePicture");
    },
  },
});
</script>

<style scoped>
.profilePicture {
  border-radius: 50%;
  max-width: 80px;
  max-height: 80px;
}
</style>
