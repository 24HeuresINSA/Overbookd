<template>
  <v-card class="filterable-user-list">
    <v-card-text>
      <div class="filters">
        <v-text-field
          v-model="volunteer"
          class="filters__field"
          label="Recherche"
        ></v-text-field>
        <SearchTeams
          v-model="teams"
          class="filters__field"
          :boxed="false"
        ></SearchTeams>
      </div>
      <v-divider />
      <div class="user-list">
        <UserList :volunteers="filteredVolunteers" />
        <p>
          Nombre de personnes dans la liste :
          <span class="font-weight-bold">{{ filteredVolunteers.length }}</span>
        </p>
        <FriendsDisplay />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import UserList from "~/components/molecules/users/UserList.vue";
import FriendsDisplay from "~/components/molecules/friends/FriendsDisplay.vue";
import SearchTeams from "~/components/atoms/SearchTeams.vue";
import { Team } from "~/utils/models/team";
import { Volunteer } from "~/utils/models/assignment";

interface FiltersData {
  teams: Team[];
  volunteer: string;
}

export default Vue.extend({
  name: "FilterableUserList",
  components: { UserList, FriendsDisplay, SearchTeams },
  data(): FiltersData {
    return {
      teams: [],
      volunteer: "",
    };
  },
  computed: {
    filteredVolunteers(): Volunteer[] {
      const filteredVolunteers = this.$accessor.assignment.volunteers.filter(
        (volunteer) => {
          return (
            this.filterVolunteerByValidity()(volunteer) &&
            this.filterVolunteerByTeams(this.teams)(volunteer)
          );
        }
      );
      return this.fuzzyFindVolunteer(filteredVolunteers, this.volunteer);
    },
  },
  methods: {
    filterVolunteerByValidity(): (volunteer: Volunteer) => boolean {
      return (volunteer) =>
        volunteer.teams.map((team) => team).includes("soft") ||
        volunteer.teams.map((team) => team).includes("hard");
    },
    filterVolunteerByTeams(
      teamsSearched: Team[]
    ): (volunteer: Volunteer) => boolean {
      return teamsSearched.length > 0
        ? (volunteer) =>
            volunteer.teams
              .map((team) => team)
              .some((code) =>
                teamsSearched.map((team) => team.code).includes(code)
              )
        : () => true;
    },
    fuzzyFindVolunteer(volunteers: Volunteer[], search?: string): Volunteer[] {
      if (!search) return volunteers;
      const fuse = new Fuse(volunteers, {
        keys: ["firstname", "lastname", "id", "charisma"],
        threshold: 0.4,
      });
      return fuse.search(search).map((e) => e.item);
    },
  },
});
</script>

<style lang="scss" scoped>
.filterable-user-list {
  overflow-y: auto;
}

.filters {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  &__field {
    width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
}

.user-list {
  display: flex;
  flex-direction: column;
}
</style>
