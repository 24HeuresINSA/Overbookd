<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">Ajouter un orga ou un team</span>
      </v-card-title>

      <v-card-text>
        <h3>Sélectionner les orgas</h3>
        <SearchUsers
          v-model="userRequests"
          :label="`Rechercher un orga`"
        ></SearchUsers>

        <h3>Ajouter une team</h3>
        <v-chip-group column>
          <v-chip
            v-for="(req, i) in teamRequests"
            :key="i"
            close
            @click:close="deleteTeamRequest(i)"
          >
            {{ req.quantity + " " + req.team.name }}
          </v-chip>
        </v-chip-group>
        <div class="flex-row">
          <v-text-field
            v-model="quantity"
            type="number"
            label="Quantité"
            :rules="[rules.number, rules.min]"
          />
          <SearchTeam
            v-model="selectedTeam"
            :label="`Rechercher une team`"
          ></SearchTeam>
          <v-btn
            rounded
            class="margin-btn"
            :disabled="!isTeamRequestValid"
            @click="addTeamRequest"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="confirmVolunteerRequirment"
          >Sauvegarder</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeam from "~/components/atoms/SearchTeam.vue";
import SearchUsers from "~/components/atoms/SearchUsers.vue";
import { FTTeamRequest, FTTimeWindow } from "~/utils/models/ft";
import { Team } from "~/utils/models/team";
import { User } from "~/utils/models/user";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "FTVolunteerRequirmentForm",
  components: { SearchUsers, SearchTeam },
  model: {
    prop: "timeWindow",
    event: "change",
  },
  props: {
    timeWindow: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    userRequests: [] as User[],
    teamRequests: [] as FTTeamRequest[],

    quantity: 1,
    selectedTeam: null as Team | null,

    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mTimeWindow(): FTTimeWindow {
      return {
        ...this.timeWindow,
        userRequests: this.userRequests,
        teamRequests: this.teamRequests,
      };
    },
    isTeamRequestValid(): boolean {
      return Boolean(this.selectedTeam && this.quantity > 0);
    },
  },
  watch: {
    timeWindow() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      if (!this.timeWindow) return;
      this.userRequests = this.timeWindow.userRequests.slice();
      this.teamRequests = this.timeWindow.teamRequests.slice();
      this.clearTeamRequestValue();
    },
    clearTeamRequestValue() {
      this.quantity = 1;
      this.selectedTeam = null;
    },
    addTeamRequest() {
      const teamRequest: FTTeamRequest = {
        quantity: this.quantity,
        team: this.selectedTeam as Team,
      };
      this.teamRequests.push(teamRequest);
      this.clearTeamRequestValue();
    },
    deleteTeamRequest(index: number) {
      this.teamRequests.splice(index, 1);
    },
    confirmVolunteerRequirment() {
      this.$emit("change", this.mTimeWindow);
    },
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;

  .flex-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .flex-row .margin-btn {
    margin-left: 20px;
    margin-bottom: 30px;
  }
}
</style>
