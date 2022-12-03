<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
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
          :disabled="isDisabled"
          @change="onChange('name', $event)"
        ></v-text-field>
        <v-select
          :value="mFA.type"
          label="Type"
          :items="all_types"
          :disabled="isDisabled"
          @change="onChange('type', $event)"
        ></v-select>
        <v-select
          :value="mFA.team_id"
          label="Equipe"
          :items="teams"
          item-value="id"
          item-text="name"
          :disabled="isDisabled"
          @change="onChange('team_id', $event)"
        ></v-select>
        <v-autocomplete
          :value="mFA.in_charge"
          label="Responsable"
          :items="users"
          item-value="id"
          item-text="username"
          :disabled="isDisabled"
          @change="onChange('in_charge', $event)"
        ></v-autocomplete>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FA, fa_type } from "~/utils/models/FA";

export default Vue.extend({
  name: "FAGeneralCard",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    users: [] as Array<any>,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    teams(): Array<any> {
      return this.$accessor.team.allTeams;
    },
    all_types(): Array<string> {
      //return fa_type as an array
      return Object.values(fa_type);
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

<style scoped>
.disabled {
  border-left: 5px solid green;
}
</style>
