<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">Ajouter des bénévoles</span>
      </v-card-title>

      <v-card-text>
        <h3>Ajouter un bénévole</h3>
        <v-chip-group>
          <v-chip
            v-for="(userRequest, i) in userRequests"
            :key="i"
            close
            @click:close="deleteUserRequest(userRequest, i)"
          >
            {{ displayUsername(userRequest.user) }}
          </v-chip>
        </v-chip-group>
        <div class="flex-row">
          <SearchUser v-model="selectedUser" />
          <v-btn
            rounded
            class="margin-btn"
            :disabled="!isUserRequestValid"
            @click="addUserRequest"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

        <h3>Ajouter des bénévoles d'une équipe</h3>
        <v-chip-group>
          <v-chip
            v-for="(teamRequest, i) in teamRequests"
            :key="i"
            close
            @click:close="deleteTeamRequest(teamRequest, i)"
          >
            {{ `${teamRequest.quantity} ${teamRequest.team.name}` }}
          </v-chip>
        </v-chip-group>
        <div class="flex-row">
          <v-text-field
            v-model="quantity"
            type="number"
            label="Quantité"
            :rules="[rules.number, rules.min]"
          />
          <SearchTeam v-model="selectedTeam" />
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
        <v-btn color="blue darken-1" text @click="confirmVolunteerRequirement"
          >Sauvegarder</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeam from "~/components/atoms/SearchTeam.vue";
import SearchUser from "~/components/atoms/SearchUser.vue";
import { FTTeamRequest, FTTimeWindow, FTUserRequest } from "~/utils/models/ft";
import { Team } from "~/utils/models/team";
import { User } from "~/utils/models/user";
import { isNumber, min } from "~/utils/rules/inputRules";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "FTVolunteerRequirementForm",
  components: { SearchTeam, SearchUser },
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
    userRequests: [] as FTUserRequest[],
    teamRequests: [] as FTTeamRequest[],

    quantity: 1,
    selectedTeam: null as Team | null,
    selectedUser: null as User | null,

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
      return Boolean(
        this.selectedTeam && this.quantity > 0 && !this.isTeamAlreadyRequested
      );
    },
    isTeamAlreadyRequested(): boolean {
      return this.teamRequests.some(
        (teamRequest) => teamRequest.team.id === this.selectedTeam?.id
      );
    },
    isUserRequestValid(): boolean {
      return Boolean(this.selectedUser && !this.isUserAlreadyRequested);
    },
    isUserAlreadyRequested(): boolean {
      return this.userRequests.some(
        (userRequest) => userRequest.user.id === this.selectedUser?.id
      );
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
      this.userRequests = [...this.timeWindow.userRequests];
      this.teamRequests = [...this.timeWindow.teamRequests];
      this.clearTeamRequestValue();
    },
    clearTeamRequestValue() {
      this.quantity = 1;
      this.selectedTeam = null;
    },
    addTeamRequest() {
      if (!this.selectedTeam) return;
      const teamRequest: FTTeamRequest = {
        quantity: +this.quantity,
        team: this.selectedTeam,
      };
      this.teamRequests.push(teamRequest);
      this.clearTeamRequestValue();
    },
    addUserRequest() {
      if (!this.selectedUser) return;
      const userRequest: FTUserRequest = {
        user: {
          id: this.selectedUser.id,
          firstname: this.selectedUser.firstname,
          lastname: this.selectedUser.lastname,
        },
      };
      this.userRequests.push(userRequest);
      this.selectedUser = null;
    },
    deleteTeamRequest(teamRequest: FTTeamRequest, index: number) {
      this.$accessor.FT.deleteTeamRequest({
        timeWindow: this.timeWindow,
        teamRequest,
      });
      this.teamRequests.splice(index, 1);
    },
    deleteUserRequest(userRequest: FTUserRequest, index: number) {
      this.$accessor.FT.deleteUserRequest({
        timeWindow: this.timeWindow,
        userRequest,
      });
      this.userRequests.splice(index, 1);
    },
    confirmVolunteerRequirement() {
      this.$emit("change", this.mTimeWindow);
    },
    displayUsername(user: User): string {
      return formatUsername(user);
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

    .margin-btn {
      margin-left: 20px;
      margin-bottom: 30px;
    }
  }
}
</style>
