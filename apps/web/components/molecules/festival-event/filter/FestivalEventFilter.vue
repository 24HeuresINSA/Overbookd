<template>
  <v-card class="festival-event-filter">
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-text-field :value="search" label="Recherche" @change="changeSearch" />
      <SearchTeam
        :team="team"
        label="Équipe"
        :boxed="false"
        @change="changeTeam"
      />
      <SearchUser
        :user="adherent"
        :label="adherentLabel"
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
import { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import {
  FaStatusLabel,
  faStatusLabels,
} from "~/utils/festival-event/festival-activity/festival-activity.model";
import { Team } from "~/utils/models/team.model";
import { User } from "@overbookd/user";
import {
  FtStatusLabel,
  ftStatusLabels,
} from "~/utils/festival-event/festival-task/festival-task.model";

type StatusLabels = (
  | { key: FestivalActivity["status"]; label: FaStatusLabel }
  | { key: FestivalTask["status"]; label: FtStatusLabel }
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
    adherentLabel: {
      type: String,
      default: "Responsable",
    },
    status: {
      type: String as () =>
        | FestivalActivity["status"]
        | FestivalTask["status"]
        | null,
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
    changeStatus(status: FestivalActivity["status"] | FestivalTask["status"]) {
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

<style lang="scss" scoped>
.festival-event-filter {
  height: fit-content;
}
</style>
