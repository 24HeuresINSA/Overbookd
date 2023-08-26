<template>
  <v-card>
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-text-field label="Recherche" @change="changeSearch"></v-text-field>
      <SearchTeam
        :value="team"
        label="Équipe"
        :boxed="false"
        @change="changeTeam"
      ></SearchTeam>

      <h3>Statut</h3>
      <v-list dense>
        <v-list-item-group :value="status" @change="changeStatus">
          <v-list-item :value="null">
            <v-list-item-title>Tous</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="[statusValue, statusLabel] in statuses"
            :key="statusValue"
            :value="statusValue"
          >
            <v-list-item-title> {{ statusLabel }} </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <slot name="additional-filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import {
  FaStatus,
  FaStatusLabel,
  faStatusLabels,
} from "~/utils/models/fa.model";
import {
  FtStatus,
  FtStatusLabel,
  ftStatusLabels,
} from "~/utils/models/ft.model";
import { Team } from "~/utils/models/team.model";

type StatusLabels = ([FaStatus, FaStatusLabel] | [FtStatus, FtStatusLabel])[];

export default Vue.extend({
  name: "FestivalEventFilter",
  components: { SearchTeam },
  props: {
    festivalEvent: {
      type: String,
      default: "FA",
    },
    search: {
      type: String,
      default: "",
    },
    team: {
      type: Object as () => Team | null,
      default: null,
    },
    status: {
      type: String as () => FaStatus | FtStatus | null,
      default: null,
    },
  },
  computed: {
    isFa(): boolean {
      return this.festivalEvent === "FA";
    },
    statuses(): StatusLabels {
      return this.isFa
        ? [...faStatusLabels.entries()]
        : [...ftStatusLabels.entries()];
    },
  },
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeStatus(status: FaStatus | FtStatus) {
      this.$emit("change:status", status);
    },
    changeTeam(team: Team) {
      this.$emit("change:team", team);
    },
  },
});
</script>
