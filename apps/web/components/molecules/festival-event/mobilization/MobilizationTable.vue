<template>
  <div class="mobilizations__listing">
    <v-data-table
      :headers="headers"
      :items="selectedTask.mobilizations"
      :items-per-page="-1"
      :custom-sort="sortMobilizations"
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
        <v-chip-group column class="mobilizations__volunteers">
          <VolunteerWithConflictsChip
            v-for="volunteer in item.volunteers"
            :key="`${item.id}-${volunteer.id}`"
            :volunteer="volunteer"
            @remove="removeVolunteer(item, volunteer.id)"
          />
          <v-btn
            color="primary"
            elevation="2"
            x-small
            fab
            @click="openAddVolunteerDialog(item)"
          >
            <v-icon> mdi-plus-thick</v-icon>
          </v-btn>
        </v-chip-group>
      </template>

      <template #item.teams="{ item }">
        <v-chip-group column class="mobilizations__teams">
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
          <v-btn
            color="primary"
            elevation="2"
            x-small
            fab
            @click="openAddTeamDialog(item)"
          >
            <v-icon> mdi-plus-thick</v-icon>
          </v-btn>
        </v-chip-group>
      </template>

      <template #item.actions="{ item }">
        <v-btn icon @click="openUpdateDialog(item)">
          <v-icon>mdi-clock-edit</v-icon>
        </v-btn>
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
      <CreateMobilizationForm
        @add="addMobilization"
        @close-dialog="closeAddDialog"
      />
    </v-dialog>

    <v-dialog v-model="isUpdateDialogOpen" max-width="600">
      <UpdateMobilizationForm
        :mobilization="selectedMobilization ?? undefined"
        @update="updateMobilization"
        @close-dialog="closeUpdateDialog"
      />
    </v-dialog>

    <v-dialog v-model="isAddVolunteerDialogOpen" max-width="600">
      <AddVolunteerInMobilizationForm
        :mobilization="selectedMobilization"
        @close-dialog="closeAddVolunteerDialog"
      />
    </v-dialog>

    <v-dialog v-model="isAddTeamDialogOpen" max-width="600">
      <AddTeamInMobilizationForm
        :mobilization="selectedMobilization"
        @close-dialog="closeAddTeamDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddVolunteerInMobilizationForm from "./AddVolunteerInMobilizationForm.vue";
import AddTeamInMobilizationForm from "./AddTeamInMobilizationForm.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import CreateMobilizationForm from "./CreateMobilizationForm.vue";
import UpdateMobilizationForm from "./UpdateMobilizationForm.vue";
import VolunteerWithConflictsChip from "~/components/atoms/chip/VolunteerWithConflictsChip.vue";
import { Header } from "~/utils/models/data-table.model";
import {
  FestivalTask,
  Mobilization,
  UpdateMobilization,
  TeamMobilization,
  Volunteer,
} from "@overbookd/festival-event";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { AddMobilizationForm } from "@overbookd/http";
import {
  SortablePeriodHeader,
  periodsSorts,
} from "~/utils/functions/sort-period";

type MobilizationTableData = {
  headers: Header[];
  isAddDialogOpen: boolean;
  isUpdateDialogOpen: boolean;
  isAddVolunteerDialogOpen: boolean;
  isAddTeamDialogOpen: boolean;
  selectedMobilization: Mobilization | null;
};

export default defineComponent({
  name: "MobilizationTable",
  components: {
    TeamChip,
    CreateMobilizationForm,
    UpdateMobilizationForm,
    AddVolunteerInMobilizationForm,
    AddTeamInMobilizationForm,
    VolunteerWithConflictsChip,
  },
  emits: ["add", "update", "remove"],
  data: (): MobilizationTableData => ({
    headers: [
      { text: "Début", value: "start" },
      { text: "Fin", value: "end" },
      { text: "Découpage", value: "durationSplitInHour" },
      { text: "Bénévoles requis", value: "volunteers", sortable: false },
      { text: "Equipes requises", value: "teams", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    isAddDialogOpen: false,
    isUpdateDialogOpen: false,
    isAddVolunteerDialogOpen: false,
    isAddTeamDialogOpen: false,
    selectedMobilization: null,
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
    sortMobilizations(
      mobilizations: Mobilization[],
      sortsBy: SortablePeriodHeader[],
      sortsDesc: boolean[],
    ) {
      const sortBy = sortsBy.at(0) ?? "start";
      const sortFnc = periodsSorts.get(sortBy);

      if (!sortFnc) return mobilizations;

      const sortDesc = sortsDesc.at(0) ?? false;
      return sortFnc(mobilizations, sortDesc);
    },
    addMobilization(mobilization: AddMobilizationForm) {
      this.$emit("add", mobilization);
    },
    updateMobilization(
      mobilizationId: Mobilization["id"],
      mobilization: UpdateMobilization,
    ) {
      this.$emit("update", mobilizationId, mobilization);
    },
    removeMobilization(mobilization: Mobilization) {
      this.$emit("remove", mobilization);
    },
    removeVolunteer(mobilization: Mobilization, volunteerId: Volunteer["id"]) {
      this.$accessor.festivalTask.removeVolunteerFromMobilization({
        mobilizationId: mobilization.id,
        volunteerId,
      });
    },
    addTeam(mobilization: Mobilization, team: TeamMobilization) {
      this.$accessor.festivalTask.addTeamToMobilization({
        mobilizationId: mobilization.id,
        team,
      });
      this.closeAddTeamDialog();
    },
    removeTeam(mobilization: Mobilization, { team }: TeamMobilization) {
      this.$accessor.festivalTask.removeTeamFromMobilization({
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
    openUpdateDialog(mobilization: Mobilization) {
      this.selectedMobilization = mobilization;
      this.isUpdateDialogOpen = true;
    },
    closeUpdateDialog() {
      this.isUpdateDialogOpen = false;
      this.selectedMobilization = null;
    },
    openAddVolunteerDialog(mobilization: Mobilization) {
      this.selectedMobilization = mobilization;
      this.isAddVolunteerDialogOpen = true;
    },
    closeAddVolunteerDialog() {
      this.isAddVolunteerDialogOpen = false;
      this.selectedMobilization = null;
    },
    openAddTeamDialog(mobilization: Mobilization) {
      this.selectedMobilization = mobilization;
      this.isAddTeamDialogOpen = true;
    },
    closeAddTeamDialog() {
      this.isAddTeamDialogOpen = false;
      this.selectedMobilization = null;
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
    align-items: center;
    gap: 5px;
  }
}
</style>
