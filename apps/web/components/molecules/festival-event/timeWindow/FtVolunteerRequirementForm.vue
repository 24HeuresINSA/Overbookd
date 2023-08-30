<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">Ajouter des bénévoles</span>
      </v-card-title>

      <v-card-text>
        <h3>Ajouter un bénévole</h3>
        <v-chip-group>
          <VolunteerRequestChip
            v-for="userRequest in allUserRequests"
            :key="userRequest.user.id"
            :user-request="userRequest"
            @delete-user-request="deleteUserRequest"
          />
        </v-chip-group>
        <div class="flex-row">
          <SearchUser v-model="selectedUser" :list="requestableUsers" />
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
            v-for="(teamRequest, i) in allTeamRequests"
            :key="i"
            close
            @click:close="deleteTeamRequest(teamRequest)"
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
        <v-btn text @click="closeDialog"> Annuler </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="confirmVolunteerRequirement">
          Sauvegarder
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VolunteerRequestChip from "~/components/atoms/chip/VolunteerRequestChip.vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import {
  FtTeamRequest,
  FtTimeWindow,
  FtUserRequest,
  FtUserRequestImpl,
} from "~/utils/models/ft.model";
import { Team } from "~/utils/models/team.model";
import { User } from "@overbookd/user";
import { isNumber, min } from "~/utils/rules/input.rules";
import { formatUsername } from "~/utils/user/user.utils";

export default Vue.extend({
  name: "FtVolunteerRequirementForm",
  components: { SearchTeam, SearchUser, VolunteerRequestChip },
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
    newUserRequests: [] as FtUserRequest[],
    newTeamRequests: [] as FtTeamRequest[],

    savedUserRequests: [] as FtUserRequest[],
    savedTeamRequests: [] as FtTeamRequest[],

    quantity: 1,
    selectedTeam: null as Team | null,
    selectedUser: null as User | null,

    rules: {
      number: isNumber,
      min: min(1),
    },
    hasChanges: false,
  }),
  computed: {
    allUserRequests(): FtUserRequest[] {
      return [
        ...this.savedUserRequests.map(FtUserRequestImpl.build),
        ...this.newUserRequests,
      ];
    },
    allTeamRequests(): FtTeamRequest[] {
      return [...this.savedTeamRequests, ...this.newTeamRequests];
    },
    mTimeWindow(): FtTimeWindow {
      return {
        ...this.timeWindow,
        userRequests: this.allUserRequests,
        teamRequests: this.allTeamRequests,
      };
    },
    isTeamRequestValid(): boolean {
      return (
        Boolean(this.selectedTeam) &&
        this.quantity > 0 &&
        !this.isTeamAlreadyRequested
      );
    },
    isTeamAlreadyRequested(): boolean {
      return this.allTeamRequests.some(
        (teamRequest) => teamRequest.team.code === this.selectedTeam?.code,
      );
    },
    isUserRequestValid(): boolean {
      return Boolean(this.selectedUser) && !this.isUserAlreadyRequested;
    },
    isUserAlreadyRequested(): boolean {
      return this.allUserRequests.some(
        (userRequest) => userRequest.user.id === this.selectedUser?.id,
      );
    },
    requestableUsers(): User[] {
      return this.$accessor.user.volunteers;
    },
  },
  watch: {
    timeWindow() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    await this.$accessor.user.fetchVolunteers();
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      this.hasChanges = false;
      if (!this.timeWindow) return;
      this.savedUserRequests = this.timeWindow.userRequests;
      this.savedTeamRequests = this.timeWindow.teamRequests;
      this.newUserRequests = [];
      this.newTeamRequests = [];
      this.clearTeamRequestValue();
    },
    clearTeamRequestValue() {
      this.quantity = 1;
      this.selectedTeam = null;
    },
    addTeamRequest() {
      if (!this.selectedTeam) return;
      const teamRequest: FtTeamRequest = {
        quantity: +this.quantity,
        team: this.selectedTeam,
      };
      this.newTeamRequests.push(teamRequest);
      this.clearTeamRequestValue();
      this.hasChanges = true;
    },
    addUserRequest() {
      if (!this.selectedUser) return;
      const userRequest = FtUserRequestImpl.build({
        user: {
          id: this.selectedUser.id,
          firstname: this.selectedUser.firstname,
          lastname: this.selectedUser.lastname,
        },
        alsoRequestedBy: [],
        isAvailable: true,
        isAlreadyAssigned: false,
      });
      this.newUserRequests.push(userRequest);
      this.selectedUser = null;
      this.hasChanges = true;
    },
    async deleteTeamRequest(teamRequest: FtTeamRequest) {
      if (!this.isSavedTeamRequest(teamRequest)) {
        this.removeTeamRequestFromNewOnes(teamRequest);
        return;
      }
      await this.$accessor.ft.deleteTeamRequest({
        timeWindow: this.timeWindow,
        teamRequest,
      });
      this.removeTeamRequestFromSavedOnes(teamRequest);
    },
    removeTeamRequestFromNewOnes(teamRequest: FtTeamRequest) {
      this.newTeamRequests = this.newTeamRequests.filter(
        ({ team }) => team.code !== teamRequest.team.code,
      );
    },
    removeTeamRequestFromSavedOnes(teamRequest: FtTeamRequest) {
      this.savedTeamRequests = this.savedTeamRequests.filter(
        ({ team }) => team.code !== teamRequest.team.code,
      );
    },
    async deleteUserRequest(userRequest: FtUserRequest) {
      if (!this.isSavedUserRequest(userRequest)) {
        this.removeUserRequestFromNewOnes(userRequest);
        return;
      }
      await this.$accessor.ft.deleteUserRequest({
        timeWindow: this.timeWindow,
        userRequest,
      });
      this.removeUserRequestFromSavedOnes(userRequest);
    },
    removeUserRequestFromNewOnes(userRequest: FtUserRequest) {
      this.newUserRequests = this.newUserRequests.filter(
        ({ user }) => user.id !== userRequest.user.id,
      );
    },
    removeUserRequestFromSavedOnes(userRequest: FtUserRequest) {
      this.savedUserRequests = this.savedUserRequests.filter(
        ({ user }) => user.id !== userRequest.user.id,
      );
    },

    isSavedTeamRequest(teamRequest: FtTeamRequest): boolean {
      return this.savedTeamRequests.some(
        (savedTeamRequest) =>
          savedTeamRequest.team.code === teamRequest.team.code,
      );
    },
    isSavedUserRequest(userRequest: FtUserRequest): boolean {
      return this.savedUserRequests.some(
        (savedUserRequest) => savedUserRequest.user.id === userRequest.user.id,
      );
    },
    confirmVolunteerRequirement() {
      if (!this.hasChanges) {
        return this.$store.dispatch("notif/pushNotification", {
          type: "warning",
          message:
            "🤔 Tu n'as pas fait de demandes, n'oublie pas d'appuyer sur +",
        });
      }
      this.$emit("change", this.mTimeWindow);
    },
    displayUsername(user: User): string {
      return formatUsername(user);
    },
    closeDialog() {
      this.$emit("close-dialog");
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
