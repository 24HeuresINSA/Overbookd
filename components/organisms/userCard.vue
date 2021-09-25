<template>
  <v-card>
    <v-img
      v-if="theUser.pp"
      :src="getPPUrl() + 'api/theUser/pp/' + theUser.pp"
      max-width="600px"
      max-height="500px"
    ></v-img>
    <v-card-title
      >Bonsoir
      {{
        theUser.nickname ? theUser.nickname : theUser.firstname
      }}</v-card-title
    >
    <v-card-subtitle
      >👋 {{ theUser.firstname }}.{{ theUser.lastname }}</v-card-subtitle
    >
    <v-card-text>
      <h3>📩 {{ theUser.email }}</h3>
      <h3>📞 +33 {{ theUser.phone }}</h3>
      <h3>😎 {{ theUser.charisma || 0 }} points de charisme</h3>
      <h3>❤️ {{ theUser.friends ? theUser.friends.length : 0 }} amis</h3>
      <h3>📆 {{ new Date(theUser.birthdate).toLocaleDateString() }}</h3>
      <h3>
        🗣 {{ theUser.assigned ? theUser.assigned.length : 0 }} tâches affectées
      </h3>
      <h3>🚗 {{ theUser.hasDriverLicense ? "✅" : "🛑" }}</h3>

      <OverChips :roles="theUser.team"></OverChips>

      <v-progress-linear :value="theUser.charisma"></v-progress-linear>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="isPPDialogOpen = true"
        >📸
        {{
          theUser.pp
            ? `Mettre à jour la photo de profil`
            : `Ajouter une photo de profil`
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import OverChips from "@/components/atoms/overChips.vue";

export default {
  name: "UserCard",
  components: { OverChips },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          firstname: "Jean mi",
          lastname: "Chel",
          email: "jaune@24heures.org",
          phone: "071234567890",
          charisma: 20,
          friends: [],
          team: ["hard"],
          birthdate: Date.now(),
          hasDriverLicense: false,
          pp: null,
        };
      },
    },
  },

  data() {
    return {
      isPPDialogOpen: false,
      theUser: this.user,
    };
  },

  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },
  },
};
</script>
