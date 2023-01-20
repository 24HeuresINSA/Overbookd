<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>Général</v-card-title>
    <v-card-subtitle>
      N'hésite pas si tu as des questions à contacter
      <a href="mailto:humain@24heures.org">humain@24heures.org</a>. Tu peux
      aussi t'aider en allant voir les FA d'avant sur
      <a href="https://cetaitmieuxavant.24heures.org">cetaitmieuxavant</a> en te
      connectant avec jeuneetcon@24heures.org.
    </v-card-subtitle>
    <v-card-text>
      <v-form>
        <v-text-field
          :value="mFA.name"
          label="Nom de la FA"
          :disabled="isValidatedByOwner"
          @change="onChange('name', $event)"
        ></v-text-field>
        <v-select
          :value="mFA.type"
          label="Type"
          :items="allTypes"
          :disabled="isValidatedByOwner"
          @change="onChange('type', $event)"
        ></v-select>
        <v-select
          :value="mFA.team_id"
          label="Equipe"
          :items="teams"
          item-value="id"
          item-text="name"
          :disabled="isValidatedByOwner"
          @change="onChange('team_id', $event)"
        ></v-select>
        <v-autocomplete
          :value="mFA.in_charge"
          label="Responsable"
          :items="users"
          item-value="id"
          :item-text="displayUsername"
          :disabled="isValidatedByOwner"
          @change="onChange('in_charge', $event)"
        ></v-autocomplete>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FA, fa_card_type, fa_type } from "~/utils/models/FA";
import {
  isAnimationValidatedBy,
  getFAValidationStatus,
} from "~/utils/festivalEvent/faUtils";
import CardErrorList from "~/components/molecules/CardErrorList.vue";
import { User } from "~/utils/models/user";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "FAGeneralCard",
  components: { CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: fa_card_type.GENERAL,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    teams(): Team[] {
      return this.$accessor.team.allTeams;
    },
    allTypes(): string[] {
      return Object.values(fa_type);
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
    users(): User[] {
      return this.$accessor.user.users;
    },
  },
  async mounted() {
    this.users = this.$accessor.user.users;
    if (this.users.length === 0) {
      this.$accessor.user.fetchUsers();
    }
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
    displayUsername({ firstname, lastname }: User): string {
      return `${firstname} ${lastname}`;
    },
  },
});
</script>
