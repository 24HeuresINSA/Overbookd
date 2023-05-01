<template>
  <div>
    <ProfilePictureDialog />
    <v-card v-if="me">
      <v-container class="d-flex flex-no-wrap">
        <v-img
          v-if="hasProfilePicture"
          :src="me.profilePicture"
          max-width="80px"
          max-height="80px"
          class="profilePicture"
        ></v-img>
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

        <OverChips :roles="me.team"></OverChips>

        <v-progress-linear
          :value="((me.charisma ?? 0) / maxCharisma) * 100"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverChips from "~/components/atoms/chip/OverChips.vue";
import ProfilePictureDialog from "~/components/molecules/user/ProfilePictureDialog.vue";
import { MyUserInformation } from "~/utils/models/user";

export default Vue.extend({
  name: "UserCard",
  components: { OverChips, ProfilePictureDialog },
  props: {
    user: {
      type: Object,
      default: () => {
        undefined;
      },
    },
  },

  data() {
    return {
      maxCharisma: 1500,
    };
  },

  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    friends(): number {
      return this.$accessor.user.mFriends.length;
    },
    hasProfilePicture(): boolean | undefined {
      return this.me.profilePicture?.includes("blob");
    },
  },

  async mounted() {
    this.maxCharisma = this.$accessor.config.getConfig("max_charisma");
    if (!this.me.profilePicture) return;
    const token = this.$auth.strategy.token.get();
    if (!token) return;
    await this.$accessor.user.getProfilePicture({ token, userId: this.me.id });
  },

  methods: {
    openProfilePictureDialog() {
      this.$store.dispatch("dialog/openDialog", "profilePicture");
    },
  },
});
</script>

<style scoped>
.pp {
  border-radius: 50%;
}
</style>
