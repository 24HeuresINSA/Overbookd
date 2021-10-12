<template>
  <div>
    <PPDialog />
    <v-card v-if="me">
      <v-container class="d-flex flex-no-wrap">
        <v-img
          v-if="me.pp"
          :src="getPPUrl() + 'api/user/pp/' + me.pp"
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
        <h3 class="mt-1">❤️ {{ me.friends ? me.friends.length : 0 }} amis</h3>
        <h3 class="mt-1">
          📆 {{ new Date(me.birthdate).toLocaleDateString() }}
        </h3>
        <h3 class="mt-1">
          🗣 {{ me.assigned ? me.assigned.length : 0 }} tâches affectées
        </h3>
        <h3 class="mt-1">🚗 {{ me.hasDriverLicense ? "✅" : "🛑" }}</h3>

        <OverChips :roles="me.team"></OverChips>

        <v-progress-linear
          :value="(me.charisma / maxCharisma) * 100"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import OverChips from "@/components/atoms/overChips.vue";
import Vue from "vue";
import { mapState } from "vuex";
import { UserState } from "~/store/user";
import { TMapState } from "~/utils/types/store";
import PPDialog from "@/components/molecules/ppDialog.vue";
import { dispatch } from "~/utils/store";

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
    };
  },

  mounted() {
    this.maxCharisma = this.$accessor.config.getConfig("max_charisma");
  },
  computed: {
    ...mapState<any, TMapState<UserState>>("user", {
      me: (state: UserState) => state.me,
    }),
  },
  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },
    openPPDialog() {
      dispatch(this, "dialog", "openDialog", "pp");
    },
  },
});
</script>

<style scoped>
.pp {
  border-radius: 50%;
}
</style>
