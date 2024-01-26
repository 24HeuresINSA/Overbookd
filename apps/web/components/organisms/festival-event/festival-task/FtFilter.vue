<template>
  <FestivalEventFilter
    festival-event="FT"
    :search="filters.search"
    :team="filters.team"
    :adherent="filters.adherent"
    :status="filters.status"
    @change:search="updateSearch"
    @change:team="updateTeam"
    @change:adherent="updateAdherent"
    @change:status="updateStatus"
  ></FestivalEventFilter>
</template>

<script lang="ts">
import { FestivalTask } from "@overbookd/festival-event";
import { User } from "@overbookd/user";
import { defineComponent } from "vue";
import FestivalEventFilter from "~/components/molecules/festival-event/filter/FestivalEventFilter.vue";
import { nonEmptyString } from "~/utils/festival-event/festival-event.filter";
import {
  TaskFilterBuilder,
  TaskFilters,
  findStatus,
} from "~/utils/festival-event/festival-task/festival-task.filter";
import { Team } from "~/utils/models/team.model";

export default defineComponent({
  name: "FtFilter",
  components: { FestivalEventFilter },
  emits: ["update:filters"],
  computed: {
    filters(): TaskFilters {
      const builder = TaskFilterBuilder.init({
        isNotEmpty: nonEmptyString,
        isExistingStatus: findStatus,
        isExistingAdherent: this.findAdherentById,
        isExistingTeam: this.$accessor.team.getTeamByCode,
      });
      const search = builder.extractQueryParamsValue(
        this.$route.query,
        "search",
      );
      const team = builder.extractQueryParamsValue(this.$route.query, "team");
      const adherent = builder.extractQueryParamsValue(
        this.$route.query,
        "adherent",
      );
      const status = builder.extractQueryParamsValue(
        this.$route.query,
        "status",
      );

      return {
        ...search,
        ...team,
        ...adherent,
        ...status,
      };
    },
  },
  watch: {
    filters() {
      this.$emit("update:filters", this.filters);
    },
  },
  methods: {
    findAdherentById(adherentId: User["id"]): User | undefined {
      return this.$accessor.user.adherents.find(({ id }) => id === adherentId);
    },
    updateSearch(search?: string) {
      this.updateQueryParams("search", search);
    },

    updateTeam(team?: Team) {
      this.updateQueryParams("team", team?.code);
    },

    updateAdherent(adherent?: User) {
      const id = adherent?.id ? `${adherent.id}` : undefined;
      this.updateQueryParams("adherent", id);
    },

    updateStatus(status?: FestivalTask["status"]) {
      this.updateQueryParams("status", status);
    },

    updateQueryParams(key: keyof TaskFilters, value?: string) {
      const currentQuery = this.$route.query;
      const path = this.$route.path;
      if (!value) {
        const { [key]: remove, ...remainingQuery } = currentQuery;
        this.$router.push({ path, query: remainingQuery });
        return;
      }
      const query = { ...currentQuery, [key]: value };
      this.$router.push({ path, query });
    },
  },
});
</script>

<style scoped lang="scss"></style>
