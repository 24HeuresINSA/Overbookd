<template>
  <v-card>
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-text-field
        :value="search"
        label="Recherche"
        @change="changeSearch"
      ></v-text-field>
      <SearchTeam
        :team="team"
        label="Équipe"
        :boxed="false"
        @change="changeTeam"
      ></SearchTeam>
      <SearchUser
        :user="adherent"
        label="Responsable"
        :list="adherents"
        :boxed="false"
        @change="changeAdherent"
      />

      <v-select
        :value="status"
        label="Statut"
        :items="statusWithLabels"
        item-value="key"
        item-text="label"
        @change="changeStatus"
      />

      <slot name="additional-filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FestivalActivity } from "@overbookd/festival-event";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import {
  FaStatusLabel,
  faStatusLabels,
} from "~/utils/festival-event/festival-activity.model";
import {
  FtStatus,
  FtStatusLabel,
  ftStatusLabels,
} from "~/utils/models/ft.model";
import { Team } from "~/utils/models/team.model";
import { User } from "@overbookd/user";

type StatusLabels = (
  | { key: FestivalActivity["status"]; label: FaStatusLabel }
  | { key: FtStatus; label: FtStatusLabel }
  | { key: null; label: "Tous" }
)[];

export default Vue.extend({
  name: "FestivalEventFilter",
  components: { SearchTeam, SearchUser },
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
    adherent: {
      type: Object as () => null,
      default: null,
    },
    status: {
      type: String as () => FestivalActivity["status"] | FtStatus | null,
      default: null,
    },
  },
  computed: {
    isFa(): boolean {
      return this.festivalEvent === "FA";
    },
    adherents(): User[] {
      return this.$accessor.user.adherents;
    },
    statusWithLabels(): StatusLabels {
      const noneOfThem = { key: null, label: "Tous" } as const;
      const keyWithLabel = this.isFa
        ? [...faStatusLabels.entries()]
        : [...ftStatusLabels.entries()];
      return [
        noneOfThem,
        ...keyWithLabel.map(([key, label]) => ({ key, label })),
      ];
    },
  },
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeStatus(status: FestivalActivity["status"] | FtStatus) {
      this.$emit("change:status", status);
    },
    changeTeam(team: Team) {
      this.$emit("change:team", team);
    },
    changeAdherent(adherent: User) {
      this.$emit("change:adherent", adherent);
    },
  },
});
</script>
