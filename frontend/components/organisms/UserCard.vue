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
        <h3 class="mt-1">
          🗣 {{ me.assigned ? me.assigned.length : 0 }} tâches affectées
        </h3>
        <h3 class="mt-1">🚗 {{ me.hasDriverLicense ? "✅" : "🛑" }}</h3>

        <OverChips :roles="me.team"></OverChips>

        <v-progress-linear
          :value="(me.charisma ?? 0 / maxCharisma) * 100"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverChips from "@/components/atoms/OverChips.vue";
import PPDialog from "@/components/molecules/ProfilePictureDialog.vue";
import { User } from "~/utils/models/repo";

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
    me(): User {
      return this.$accessor.user.me;
    },
    friends(): number {
      return this.$accessor.user.mFriends.length;
    },
  },

  async mounted() {
    this.maxCharisma = this.$accessor.config.getConfig("max_charisma");
    this.url = await this.getPP();
  },
  methods: {
    openPPDialog() {
      this.$store.dispatch("dialog/openDialog", "pp");
    },
    async getPP(): Promise<string> {
      const token = localStorage.getItem("auth._token.local");
      console.log(token);
      const response = await fetch(
        `${process.env.BASE_URL}user/pp/${this.me.pp}`,
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (response.status === 200) {
        const url = URL.createObjectURL(await response.blob());
        console.log(response.blob);
        console.log(url);
        return url;
      }
      return "";
    },
  },
});
</script>

<style scoped>
.pp {
  border-radius: 50%;
}
</style>
