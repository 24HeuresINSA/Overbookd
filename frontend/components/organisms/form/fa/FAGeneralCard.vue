<template>
  <v-card :class="validationStatus">
    <CardErrorList :type="cardType" />
    <v-card-title>Général</v-card-title>
    <v-card-subtitle>
      N'hésite pas si tu as des questions à contacter humain@24heures.org. Tu
      peux aussi t'aider en allant voir les FA d'avant sur
      cetaitmieuxavant.24heures.org/ en te connectant avec
      jeuneetcon@24heures.org
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
          item-text="username"
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
} from "~/utils/fa/faUtils";
import CardErrorList from "~/components/molecules/CardErrorList.vue";

export default Vue.extend({
  name: "FAGeneralCard",
  components: { CardErrorList },
  data: () => ({
    users: [] as any[],
    owner: "humain",
    cardType: fa_card_type.GENERAL,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    teams(): any[] {
      return this.$accessor.team.allTeams;
    },
    allTypes(): string[] {
      //return fa_type as an array
      return Object.values(fa_type);
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, [this.owner]).toLowerCase();
    },
  },
  async mounted() {
    this.users = this.$accessor.user.usernames;
    if (this.users.length === 0) {
      // fetch usernames
      await this.$accessor.user.getUsername("");
      this.users = this.$accessor.user.usernames;
    }
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>
