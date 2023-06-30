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
        <SearchTeam
          :team="mFA.teamId"
          label="Équipe"
          :boxed="false"
          :disabled="isValidatedByOwner"
          @change="onChange('teamId', $event.id)"
        ></SearchTeam>
        <SearchUser
          :user="mFA.userInChargeId"
          label="Responsable"
          :boxed="false"
          :disabled="isValidatedByOwner"
          @change="onChange('userInChargeId', $event.id)"
        ></SearchUser>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import CardErrorList from "~/components/molecules/festivalEvent/validation/CardErrorList.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import { Fa, FaCardType, FaType } from "~/utils/models/fa";
import { User } from "~/utils/models/user";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";

export default Vue.extend({
  name: "FAGeneralCard",
  components: { CardErrorList, SearchUser, SearchTeam },
  data: () => ({
    owner: "humain",
    cardType: FaCardType.GENERAL,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.FA.mFA;
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
    users(): User[] {
      return this.$accessor.user.users;
    },
  },
  async mounted() {
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
