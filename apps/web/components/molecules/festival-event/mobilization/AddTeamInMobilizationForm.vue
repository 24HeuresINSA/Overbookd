<template>
  <ConfirmationMessage
    confirm-color="success"
    @close-dialog="closeAddTeamDialog"
    @confirm="addTeam"
  >
    <template #title>Ajouter des bénévoles d'une équipe</template>
    <template #statement>
      <v-text-field
        v-model="count"
        type="number"
        label="Nombre de bénévoles"
        :rules="[rules.number, rules.min]"
      />
      <SearchTeam v-model="team" :list="selectableTeams" hide-details />
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-plus-circle-outline </v-icon>Ajouter
    </template>
  </ConfirmationMessage>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import { Mobilization } from "@overbookd/festival-event";
import { Team } from "~/utils/models/team.model";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

type AddTeamInMobilizationFormData = InputRulesData & {
  team: Team | null;
  count: number;
};

export default defineComponent({
  name: "AddTeamInMobilizationForm",
  components: { ConfirmationMessage, SearchTeam },
  props: {
    mobilization: {
      type: Object as () => Mobilization | null,
      default: null,
    },
  },
  data: (): AddTeamInMobilizationFormData => ({
    team: null,
    count: 1,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    selectableTeams(): Team[] {
      return this.$accessor.team.mobilizableTeams.filter((team) => {
        const teams = this.mobilization?.teams ?? [];
        return !teams.some((t) => t.team === team.code);
      });
    },
  },
  methods: {
    addTeam() {
      if (!this.team || +this.count < 1 || !this.mobilization) return;
      const team = {
        team: this.team.code,
        count: +this.count,
      };
      this.$accessor.festivalTask.addTeamToMobilization({
        mobilizationId: this.mobilization.id,
        team,
      });
      this.closeAddTeamDialog();
    },
    closeAddTeamDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>
