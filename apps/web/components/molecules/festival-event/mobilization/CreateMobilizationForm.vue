<template>
  <v-card class="mobilization-card">
    <v-btn class="mobilization-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="mobilization-card__title">
      <h2>Ajouter une mobilisation</h2>
    </v-card-title>

    <v-card-subtitle>
      La manif commencera le {{ displayedManifDate }}.
    </v-card-subtitle>

    <v-card-text class="pb-0">
      <MobilizationPeriodFormFields
        :start="start"
        :end="end"
        :duration-split-in-hour="durationSplitInHour"
        @update:start="updateStart"
        @update:end="updateEnd"
        @update:duration-split-in-hour="updateDurationSplitInHour"
      />

      <h3>Ajouter un bénévole</h3>
      <v-chip-group>
        <v-chip
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          close
          @click:close="removeVolunteer(volunteer.id)"
        >
          {{ formatUserNameWithNickname(volunteer) }}
        </v-chip>
      </v-chip-group>
      <div class="mobilization-card__form">
        <SearchUser
          :value="volunteerToAdd"
          :list="addableVolunteers"
          hide-details
          @change="addVolunteer"
        />
      </div>

      <h3>Ajouter des bénévoles d'une équipe</h3>
      <v-chip-group>
        <TeamChip
          v-for="team in teams"
          :key="team.team"
          :team="team.team"
          :prefix="team.count"
          with-name
          show-hidden
          close
          @close="removeTeam(team)"
        />
      </v-chip-group>
      <div class="mobilization-card__form">
        <v-text-field
          v-model="teamQuantity"
          type="number"
          label="Nombre de bénévoles"
          :rules="[rules.number, rules.min]"
        />
        <SearchTeam v-model="teamToAdd" :list="selectableTeams" hide-details />
        <v-btn class="mobilization-card__form-btn" rounded @click="addTeam">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </v-card-text>

    <v-card-actions class="mobilization-card__actions">
      <v-btn
        :disabled="!canAddMobilization"
        color="primary"
        large
        @click="addMobilization"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter la mobilisation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import MobilizationPeriodFormFields from "./MobilizationPeriodFormFields.vue";
import { formatDate } from "~/utils/date/date.utils";
import { IProvidePeriod, Period } from "@overbookd/period";
import { TeamMobilization, Volunteer } from "@overbookd/festival-event";
import { AddMobilizationForm } from "@overbookd/http";
import { Team } from "@overbookd/http";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";
import { User } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

type CreateMobilizationFormData = IProvidePeriod &
  InputRulesData & {
    durationSplitInHour: number | null;
    teams: TeamMobilization[];
    volunteers: Volunteer[];
    volunteerToAdd: Volunteer | null;
    teamToAdd: Team | null;
    teamQuantity: number;
  };

export default defineComponent({
  name: "CreateMobilizationForm",
  components: {
    SearchUser,
    SearchTeam,
    TeamChip,
    MobilizationPeriodFormFields,
  },
  emits: ["add", "close-dialog"],
  data: (): CreateMobilizationFormData => ({
    start: new Date(),
    end: new Date(),
    durationSplitInHour: null,
    teams: [],
    volunteers: [],

    volunteerToAdd: null,
    teamToAdd: null,
    teamQuantity: 1,

    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mobilization(): AddMobilizationForm {
      return {
        start: this.start,
        end: this.end,
        durationSplitInHour: this.durationSplitInHour,
        teams: this.teams,
        volunteers: this.volunteers.map((volunteer) => volunteer.id),
      };
    },
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    displayedManifDate(): string {
      return `vendredi ${formatDate(this.eventStartDate)}`;
    },
    canAddMobilization(): boolean {
      const isPeriodValid = Period.isValid({
        start: this.start,
        end: this.end,
      });
      const isDurationValid =
        this.durationSplitInHour === null || this.durationSplitInHour > 0;

      return isPeriodValid && isDurationValid;
    },
    addableVolunteers(): User[] {
      return this.$accessor.user.volunteers.filter(
        (volunteer) => !this.volunteers.some((v) => v.id === volunteer.id),
      );
    },
    selectableTeams(): Team[] {
      return this.$accessor.team.mobilizableTeams.filter(
        (team) => !this.teams.some((t) => t.team === team.code),
      );
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    await this.$accessor.user.fetchVolunteers();
    this.clearData();
  },
  methods: {
    clearData() {
      this.start = this.eventStartDate;
      this.end = this.eventStartDate;
      this.durationSplitInHour = null;
      this.teams = [];
      this.volunteers = [];
      this.volunteerToAdd = null;
      this.teamToAdd = null;
      this.teamQuantity = 1;
    },
    addMobilization() {
      if (!this.canAddMobilization) return;
      this.$emit("add", this.mobilization);

      this.closeDialog();
      this.clearData();
    },
    updateStart(start: Date) {
      this.start = start;
    },
    updateEnd(end: Date) {
      this.end = end;
    },
    updateDurationSplitInHour(durationSplitInHour: number | null) {
      this.durationSplitInHour = durationSplitInHour;
    },
    addTeam() {
      if (!this.teamToAdd) return;
      const team = this.teamToAdd.code;
      const count = +this.teamQuantity;
      this.teams = [...this.teams, { team, count }];

      this.teamToAdd = null;
      this.teamQuantity = 1;
    },
    removeTeam({ team }: TeamMobilization) {
      this.teams = this.teams.filter((t) => t.team !== team);
    },
    addVolunteer(volunteer: Volunteer | null) {
      if (volunteer === null) return;
      this.volunteers = [...this.volunteers, volunteer];
      this.volunteerToAdd = null;
    },
    removeVolunteer(volunteerId: Volunteer["id"]) {
      this.volunteers = this.volunteers.filter((v) => v.id !== volunteerId);
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped>
.mobilization-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__form {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
    &-btn {
      margin-top: 10px;
    }
    @media screen and (max-width: $mobile-max-width) {
      flex-direction: column;
      align-items: flex-start;
      * {
        width: 100%;
      }
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
