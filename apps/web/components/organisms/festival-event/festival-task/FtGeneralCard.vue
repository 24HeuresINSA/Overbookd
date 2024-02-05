<template>
  <v-card>
    <v-card-title>Général</v-card-title>

    <v-card-subtitle>
      <p>
        N'hésite pas si tu as des questions à contacter
        <a :href="`mailto:humain@24heures.org`"> humain@24heures.org </a>
        .
      </p>
      <p>
        Tu peux aussi t'aider en allant voir les FT de l'année dernière sur
        <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a>
        en te connectant avec jeuneetcon@24heures.org.
      </p>
    </v-card-subtitle>

    <v-card-text>
      <v-text-field
        :value="general.name"
        label="Nom de la FT"
        @change="updateName"
      />
      <SearchUser
        :user="general.administrator"
        label="Responsable de la FT"
        :boxed="false"
        @change="updateAdministrator"
      />
      <SearchTeam
        :team="inChargeTeam"
        label="Équipe"
        :boxed="false"
        @change="updateTeam"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import { Team } from "~/utils/models/team.model";
import { User } from "@overbookd/user";
import { FestivalTask } from "@overbookd/festival-event";

export default Vue.extend({
  name: "FtGeneralCard",
  components: { SearchUser, SearchTeam },
  computed: {
    mFT(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    general(): FestivalTask["general"] {
      return this.mFT.general;
    },
    inChargeTeam(): Team | undefined {
      return this.$accessor.team.getTeamByCode(this.general.team ?? "");
    },
  },
  methods: {
    updateName(name: string) {
      this.$accessor.festivalTask.updateGeneral({ name });
    },
    updateAdministrator(administrator: User) {
      const administratorId = administrator.id;
      this.$accessor.festivalTask.updateGeneral({ administratorId });
    },
    updateTeam(team: Team) {
      this.$accessor.festivalTask.updateGeneral({ team: team.code });
    },
  },
});
</script>
