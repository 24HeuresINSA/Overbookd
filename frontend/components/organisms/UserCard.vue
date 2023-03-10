<template>
  <div>
    <PPDialog />
    <v-card v-if="me">
      <v-container class="d-flex flex-no-wrap">
        <v-img
          v-if="me.pp"
          :src="url"
          max-width="80px"
          max-height="80px"
          class="pp"
        ></v-img>
        <div>
          <v-card-title class="pt-2"
            >Bonsoir
            {{ me.nickname ? me.nickname : me.firstname }} 👋</v-card-title
          >
          <v-card-subtitle>
            {{ me.firstname }}.{{ me.lastname }}</v-card-subtitle
          >
        </div>
      </v-container>
      <v-card-actions class="d-flex justify-start">
        <v-btn text max-width="300px" @click="openPPDialog()"
          >📸
          {{ me.pp ? `Mettre à jour` : `Ajouter` }}
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
        <h3 class="mt-1">🗣 0 tâches affectées</h3>
        <h3 class="mt-1">🚗 {{ hasDriverLicense ? "✅" : "🛑" }}</h3>

        <OverChips :roles="me.team"></OverChips>

        <v-progress-linear
<<<<<<< HEAD
<<<<<<< HEAD
          :value="((me.charisma ?? 0) / maxCharisma) * 100"
=======
          :value="(me.charisma ?? 0 / maxCharisma) * 100"
>>>>>>> e77c3496 (feat(Front): ✨ add friends for hard #883)
=======
          :value="((me.charisma ?? 0) / maxCharisma) * 100"
>>>>>>> 425eafdb (fix: User update in human page)
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD
import OverChips from "@/components/atoms/OverChips.vue";
import PPDialog from "@/components/molecules/ProfilePictureDialog.vue";
import Vue from "vue";
import userRepo from "~/repositories/userRepo";
import { CompleteUser } from "~/utils/models/user";
=======
import Vue from "vue";
import OverChips from "~/components/atoms/OverChips.vue";
import ProfilePictureDialog from "~/components/molecules/ProfilePictureDialog.vue";
<<<<<<< HEAD
import { User } from "~/utils/models/repo";
>>>>>>> e77c3496 (feat(Front): ✨ add friends for hard #883)
=======
import { CompleteUser } from "~/utils/models/user";
>>>>>>> 425eafdb (fix: User update in human page)

export default Vue.extend({
  name: "UserCard",
  components: { OverChips, PPDialog },
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
      url: "",
    };
  },

  computed: {
<<<<<<< HEAD
<<<<<<< HEAD
    me(): CompleteUser {
      return this.$accessor.user.me;
=======
    me(): User {
=======
    me(): CompleteUser {
>>>>>>> 425eafdb (fix: User update in human page)
      return this.$accessor.user.me;
    },
    friends(): number {
      return this.$accessor.user.mFriends.length;
    },
    hasDriverLicense(): boolean {
      return this.me.team.includes("conducteur");
    },
  },

  mounted() {
    this.maxCharisma = this.$accessor.config.getConfig("max_charisma");
  },

  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
>>>>>>> e77c3496 (feat(Front): ✨ add friends for hard #883)
    },
    friends(): number {
      return this.$accessor.user.mFriends.length;
    },
    hasDriverLicense(): boolean {
      return this.me.team.includes("conducteur");
    },
  },

  async mounted() {
    this.maxCharisma = this.$accessor.config.getConfig("max_charisma");
    this.url = (await this.getPP()) as string;
  },
  methods: {
    openPPDialog() {
      this.$store.dispatch("dialog/openDialog", "pp");
    },
    async getPP() {
      const token = this.$auth.strategy.token.get();
      if (token && this.me.pp) {
        const url = await userRepo.getPP(this.me.pp, token);
        if (url) {
          return url;
        }
      }
    },
  },
});
</script>

<style scoped>
.pp {
  border-radius: 50%;
}
</style>
