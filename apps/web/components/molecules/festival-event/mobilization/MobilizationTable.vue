<template>
  <div class="mobilizations__listing">
    <v-data-table
      :headers="headers"
      :items="selectedTask.mobilizations"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
    >
      <template #item.start="{ item }">
        {{ formatDateWithMinutes(item.start) }}
      </template>

      <template #item.end="{ item }">
        {{ formatDateWithMinutes(item.end) }}
      </template>

      <template #item.durationSplitInHour="{ item }">
        {{ formatDurationSplitInHour(item.durationSplitInHour) }}
      </template>

      <template #item.volunteers="{ item }">
        <div class="mobilizations__volunteers">
          <NuxtLink
            v-for="volunteer in item.volunteers"
            :key="`${item.id}-${volunteer.id}`"
            :to="`/planning/${volunteer.id}`"
          >
            <v-chip close @click:close="removeVolunteer(item, volunteer.id)">
              {{ formatUserNameWithNickname(volunteer) }}
            </v-chip>
          </NuxtLink>
        </div>
      </template>

      <template #item.teams="{ item }">
        <div class="mobilizations__teams">
          <TeamChip
            v-for="team in item.teams"
            :key="`${item.id}-${team.team}`"
            :team="team.team"
            :count="team.count"
            with-name
            show-hidden
            close
            @close="removeTeam(item, team)"
          />
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon @click="removeMobilization(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </template>

      <template #no-data> Aucune mobilisation </template>
    </v-data-table>

    <v-btn color="primary" class="mobilizations__add" @click="openAddDialog">
      Ajouter une mobilisation
    </v-btn>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <MobilizationForm @add="addMobilization" @close-dialog="closeAddDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import MobilizationForm from "./MobilizationForm.vue";
import { Header } from "~/utils/models/data-table.model";
import {
  FestivalTask,
  Mobilization,
  TeamMobilization,
  Volunteer,
} from "@overbookd/festival-event";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { AddMobilizationForm } from "@overbookd/http";

type MobilizationTableData = {
  headers: Header[];
  isAddDialogOpen: boolean;
};

export default defineComponent({
  name: "MobilizationTable",
  components: { TeamChip, MobilizationForm },
  emits: ["add", "remove"],
  data: (): MobilizationTableData => ({
    headers: [
      { text: "Début", value: "start" },
      { text: "Fin", value: "end" },
      { text: "Découpage", value: "durationSplitInHour" },
      { text: "Bénévoles requis", value: "volunteers" },
      { text: "Equipes requises", value: "teams" },
      { text: "Actions", value: "actions" },
    ],
    isAddDialogOpen: false,
  }),
  computed: {
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
  },
  methods: {
    formatUserNameWithNickname,
    formatDateWithMinutes,
    formatDurationSplitInHour(duration: number | null): string {
      return duration ? `${duration}h` : "";
    },
    addMobilization(mobilization: AddMobilizationForm) {
      this.$emit("add", mobilization);
    },
    removeMobilization(mobilization: Mobilization) {
      this.$emit("remove", mobilization);
    },
    removeVolunteer(mobilization: Mobilization, volunteerId: Volunteer["id"]) {
      this.$accessor.festivalTask.removeMobilizationVolunteer({
        mobilizationId: mobilization.id,
        volunteerId,
      });
    },
    removeTeam(mobilization: Mobilization, { team }: TeamMobilization) {
      this.$accessor.festivalTask.removeMobilizationTeam({
        mobilizationId: mobilization.id,
        team,
      });
    },
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.mobilizations {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 5px;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
  &__teams,
  &__volunteers {
    display: flex;
    gap: 5px;
  }
}
</style>
