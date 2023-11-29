<template>
  <v-card>
    <v-card-title>Responsable</v-card-title>

    <v-card-subtitle>
      N'hésite pas si tu as des questions à contacter
      <a href="mailto:humain@24heures.org">humain@24heures.org</a>. Tu peux
      aussi t'aider en allant voir les FA d'avant sur
      <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a> en te
      connectant avec jeuneetcon@24heures.org.
    </v-card-subtitle>

    <v-card-text>
      <SearchTeam
        :team="team"
        label="Équipe"
        :boxed="false"
        @change="updateTeam($event)"
      />

      <SearchUser
        :user="inCharge.adherent"
        label="Adhérent"
        :boxed="false"
        :list="adherents"
        @change="updateAdherent($event)"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import { FestivalActivity } from "@overbookd/festival-activity";
import { User } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";

export default defineComponent({
  name: "FaGeneralCard",
  components: { SearchUser, SearchTeam },
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    inCharge(): FestivalActivity["inCharge"] {
      return this.mFA.inCharge;
    },
    team(): Team | null {
      return this.inCharge.team
        ? this.$accessor.team.getTeamByCode(this.inCharge.team)
        : null;
    },
    adherents(): User[] {
      return this.$accessor.user.adherents;
    },
  },
  async mounted() {
    if (this.adherents.length === 0) {
      await this.$accessor.user.fetchAdherents();
    }
  },
  methods: {
    updateTeam(team: string) {
      console.log("update team", team);
      // TODO: update team
    },
    updateAdherent(adherent: User) {
      console.log("update adherent", adherent);
      // TODO: update name
    },
  },
});
</script>
