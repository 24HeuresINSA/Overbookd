<template>
  <div class="registrations">
    <h1>Admission bénévoles</h1>
    <v-data-table
      :headers="headers"
      :items="filteredVolunteersToEnroll"
      :expanded.sync="displayedVolunteers"
      :items-per-page="30"
      show-expand
      @click:row="openOrCloseVolunteerDetails"
    >
      <template #top>
        <div class="filters">
          <v-text-field
            v-model="searchVolunteer"
            label="Rechercher par nom"
            class="search"
          />
          <SearchTeam
            v-model="searchTeam"
            :list="searchableTeams"
            class="team"
            label="Rechercher par équipe"
            :boxed="false"
          />
        </div>
      </template>

      <template #item.registeredAt="{ item }">
        {{ formatDate(item.registeredAt) }}
      </template>

      <template #item.name="{ item }">
        {{ formatUserNameWithNickname(item) }}
      </template>

      <template #item.teams="{ item }">
        <TeamChip v-for="team of item.teams" :key="team" :team="team" />
      </template>

      <template #item.action="{ item }">
        <v-btn color="success" small @click="enroll(item)">
          <v-icon left> mdi-check </v-icon>
          Enrôler
        </v-btn>
        <v-btn color="error" small @click="openForgetVolunteerDialog(item)">
          <v-icon left> mdi-trash-can </v-icon>
          Supprimer
        </v-btn>
      </template>

      <template #expanded-item="{ item }">
        <td :colspan="headers.length">
          <VolunteerDetails :volunteer="item" />
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="isForgetVolunteerDialogOpen" max-width="600">
      <ConfirmationMessage
        @confirm="forgetVolunteer"
        @close-dialog="closeForgetVolunteerDialog"
      >
        <template #title>Supprimer un bénévole</template>
        <template #statement>
          Le bénévole <strong>{{ volunteerToForgetName }}</strong> sera supprimé
          DEFINITIVEMENT !!!
          <br />
          Sois bien sûr de toi avant de valider.
        </template>
      </ConfirmationMessage>
    </v-dialog>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EnrollableVolunteer, Team } from "@overbookd/http";
import { removeItemAtIndex } from "@overbookd/list";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatLocalDate } from "~/utils/date/date.utils";
import { Header } from "~/utils/data-table/header";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import VolunteerDetails from "~/components/molecules/registration/VolunteerDetails.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import { TEAM_CODES, VOLUNTEER } from "@overbookd/registration";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";

type RegistrationsData = {
  headers: Header[];
  displayedVolunteers: EnrollableVolunteer[];
  isForgetVolunteerDialogOpen: boolean;
  volunteerToForget: EnrollableVolunteer | null;
  searchVolunteer: string;
  searchTeam: Team | null;
};

type Filter = (newcomer: Searchable<EnrollableVolunteer>) => boolean;

export default defineComponent({
  name: "RegistrationsSoft",
  components: {
    SnackNotificationContainer,
    TeamChip,
    VolunteerDetails,
    ConfirmationMessage,
    SearchTeam,
  },
  data: (): RegistrationsData => ({
    headers: [
      { text: "Inscription", value: "registeredAt" },
      { text: "Nom", value: "name" },
      { text: "Charisme", value: "charisma" },
      { text: "Équipes", value: "teams", sortable: false },
      { text: "Action", value: "action", sortable: false },
      { text: "", value: "data-table-expand", sortable: false },
    ],
    displayedVolunteers: [],
    isForgetVolunteerDialogOpen: false,
    volunteerToForget: null,
    searchVolunteer: "",
    searchTeam: null,
  }),
  head: () => ({
    title: "Admission bénévoles",
  }),
  computed: {
    searchableTeams(): Team[] {
      return TEAM_CODES.map((code) =>
        this.$accessor.team.getTeamByCode(code),
      ).filter((team): team is Team => team !== undefined);
    },
    volunteerToForgetName(): string {
      if (!this.volunteerToForget) return "";
      return formatUserNameWithNickname(this.volunteerToForget);
    },
    searchableVolunteersToEnroll(): Searchable<EnrollableVolunteer>[] {
      return this.$accessor.registration.volunteers.map((newcomer) => ({
        ...newcomer,
        searchable: SlugifyService.apply(
          `${newcomer.firstname} ${newcomer.lastname} ${newcomer.mobilePhone}`,
        ),
      }));
    },
    filteredVolunteersToEnroll(): EnrollableVolunteer[] {
      const search = SlugifyService.apply(this.searchVolunteer);
      return this.searchableVolunteersToEnroll.filter((volunteer) => {
        return (
          this.isMatchingNameSearch(search)(volunteer) &&
          this.isMatchingTeam(this.searchTeam)(volunteer)
        );
      });
    },
  },
  mounted() {
    this.$accessor.registration.getVolunteers();
  },
  methods: {
    formatDate(date: Date): string {
      return formatLocalDate(date);
    },
    openOrCloseVolunteerDetails(volunteer: EnrollableVolunteer) {
      const volunteerIndex = this.displayedVolunteers.findIndex(
        ({ id }) => id === volunteer.id,
      );
      const dontDisplayDetailsYet = volunteerIndex === -1;
      if (dontDisplayDetailsYet) {
        this.displayedVolunteers = [...this.displayedVolunteers, volunteer];
        return;
      }
      this.displayedVolunteers = removeItemAtIndex(
        this.displayedVolunteers,
        volunteerIndex,
      );
    },
    forgetVolunteer() {
      if (!this.volunteerToForget) return;
      this.openOrCloseVolunteerDetails(this.volunteerToForget);
      this.$accessor.registration.forget({
        membership: VOLUNTEER,
        email: this.volunteerToForget.email,
      });
      this.volunteerToForget = null;
    },
    openForgetVolunteerDialog(volunteer: EnrollableVolunteer) {
      this.volunteerToForget = volunteer;
      this.isForgetVolunteerDialogOpen = true;
    },
    closeForgetVolunteerDialog() {
      this.isForgetVolunteerDialogOpen = false;
      this.volunteerToForget = null;
    },
    enroll(volunteer: EnrollableVolunteer) {
      this.$accessor.registration.enrollNewVolunteers([volunteer]);
    },
    isMatchingNameSearch(search: string): Filter {
      return ({ searchable }: Searchable<EnrollableVolunteer>) =>
        searchable.includes(search);
    },
    isMatchingTeam(team: Team | null): Filter {
      return ({ teams }: Searchable<EnrollableVolunteer>) => {
        if (!team) return true;
        return teams.some((code) => code === team.code);
      };
    },
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped>
.registrations {
  margin-left: 10px;
  @media screen and (max-width: $mobile-max-width) {
    margin-left: 0;
  }
}

.filters {
  display: flex;
  gap: 20px;
  margin: 10px 20px;
}
</style>
