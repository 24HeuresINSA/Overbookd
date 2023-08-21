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
          @change="updateName($event)"
        ></v-text-field>
        <v-select
          :value="mFA.type"
          label="Type"
          :items="allTypes"
          :disabled="isValidatedByOwner"
          @change="updateType($event)"
        ></v-select>
        <SearchTeam
          :team="mFA.team"
          label="Équipe"
          :boxed="false"
          :disabled="isValidatedByOwner"
          @change="updateTeam($event)"
        ></SearchTeam>
        <SearchUser
          :user="mFA.userInCharge"
          label="Responsable"
          :boxed="false"
          :disabled="isValidatedByOwner"
          @change="updateUserInCharge($event)"
        ></SearchUser>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import CardErrorList from '~/components/molecules/festival-event/validation/CardErrorList.vue';
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from '~/utils/festival-event/faUtils';
import { Fa, FaCardType, FaType } from '~/utils/models/fa';
import { User } from '~/utils/models/user';
import SearchTeam from '~/components/atoms/field/search/SearchTeam.vue';
import SearchUser from '~/components/atoms/field/search/SearchUser.vue';
import { Team } from '~/utils/models/team';

export default Vue.extend({
  name: 'FaGeneralCard',
  components: { CardErrorList, SearchUser, SearchTeam },
  data: () => ({
    owner: 'humain',
    cardType: FaCardType.GENERAL,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    allTypes(): string[] {
      return Object.values(FaType);
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  methods: {
    updateName(name: string) {
      return this.$accessor.fa.updateFaChunk({ name: name.trim() });
    },
    updateType(type?: FaType) {
      return this.$accessor.fa.updateFaChunk({ type });
    },
    updateTeam(team?: Team) {
      return this.$accessor.fa.updateFaChunk({ team });
    },
    updateUserInCharge(userInCharge?: User) {
      return this.$accessor.fa.updateFaChunk({ userInCharge });
    },
  },
});
</script>
