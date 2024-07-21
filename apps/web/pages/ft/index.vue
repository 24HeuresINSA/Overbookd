<template>
  <div class="task ft">
    <v-card class="task__listing">
      <v-data-table
        :headers="tableHeaders"
        :items="tasks"
        :items-per-page="20"
        class="task__table"
        :loading="loading"
        loading-text="Chargement des fiches tâches..."
        no-data-text="Aucune fiche tâche trouvée"
        :hover="tasks.length > 0"
        @click:row="openTask"
        @auxclick:row="openTaskInNewTab"
      >
        <template #item.id="{ item }">
          <v-chip-group id="status">
            <v-chip :class="item.status.toLowerCase()">
              {{ item.id }}
            </v-chip>
          </v-chip-group>
        </template>

        <template #item.reviews="{ item }">
          <v-chip-group id="reviewers" column>
            <v-chip
              v-for="reviewer of reviewers"
              :key="reviewer.code"
              :class="getReviewerStatus(item, reviewer)"
              size="small"
            >
              <v-icon size="small"> {{ reviewer.icon }} </v-icon>
            </v-chip>
          </v-chip-group>
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
        </template>

        <template #item.administrator="{ item }">
          {{ formatUsername(item.administrator) }}
        </template>

        <template #item.removal="{ item }">
          <v-btn
            icon="mdi-delete"
            size="small"
            @click.stop="openRemovalDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card>
  </div>

  <v-btn
    icon="mdi-plus-thick"
    size="large"
    color="primary"
    class="btn-plus"
    @click="openNewTaskDialog"
  />

  <v-dialog v-model="isNewTaskDialogOpen" width="600">
    <NewFtCard @close="closeNewTaskDialog" />
  </v-dialog>

  <v-dialog v-model="isRemovalDialogOpen" max-width="600">
    <ConfirmationMessage
      confirm-color="error"
      @close="closeRemovalDialog"
      @confirm="removeTask"
    >
      <template #title>
        Suppression de la FT #<strong>
          {{ taskToRemove?.id }}
        </strong>
      </template>
      <template #statement>
        Tu es sur le point de supprimer la FT
        <strong>{{ taskToRemove?.name }}.</strong>
        Es-tu sûr de faire ça ?
      </template>
      <template #confirm-btn-content>
        <v-icon left> mdi-delete </v-icon>Supprimer
      </template>
    </ConfirmationMessage>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { PreviewFestivalTask, Reviewer } from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { WRITE_FT } from "@overbookd/permission";
import type { TableHeaders } from "~/utils/data-table/header";
import { formatUsername } from "~/utils/user/user.utils";
import { isDraftPreview } from "~/utils/festival-event/festival-task/festival-task.model";
import { findReviewStatus } from "~/utils/festival-event/festival-task/festival-task.filter";
import { openTask, openTaskInNewTab } from "~/utils/festival-event/open-page";

useHead({ title: "Fiches Tâches" });

const ftStore = useFestivalTaskStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

const canRemoveTask = computed<boolean>(() => userStore.can(WRITE_FT));
const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Statut", value: "id", sortable: true },
    { title: "Validations", value: "reviews" },
    { title: "Nom", value: "name", sortable: true },
    { title: "Equipe", value: "team", sortable: true },
    { title: "Gestionnaire", value: "administrator" },
  ];
  const removalHeader = { title: "Suppression", value: "removal" };
  return canRemoveTask.value ? [...baseHeaders, removalHeader] : baseHeaders;
});

const tasks = computed<PreviewFestivalTask[]>(() => ftStore.tasks.forAll);
const reviewers = computed<Team[]>(() => teamStore.ftReviewers);

await teamStore.fetchFtReviewers();
const loading = ref<boolean>(tasks.value.length === 0);
ftStore.fetchAllTasks().then(() => (loading.value = false));

const isNewTaskDialogOpen = ref<boolean>(false);
const openNewTaskDialog = () => (isNewTaskDialogOpen.value = true);
const closeNewTaskDialog = () => (isNewTaskDialogOpen.value = false);

const taskToRemove = ref<PreviewFestivalTask | undefined>(undefined);
const isRemovalDialogOpen = ref<boolean>(false);
const openRemovalDialog = (task: PreviewFestivalTask) => {
  taskToRemove.value = task;
  isRemovalDialogOpen.value = true;
};
const closeRemovalDialog = () => {
  isRemovalDialogOpen.value = false;
  taskToRemove.value = undefined;
};
const removeTask = () => {
  if (!taskToRemove.value) return;
  ftStore.remove(taskToRemove.value.id);
};

const getReviewerStatus = (task: PreviewFestivalTask, reviewer: Team) => {
  if (isDraftPreview(task)) return "";
  const reviewerCode = reviewer.code as Reviewer<"FT">;
  const status = task.reviews[`${reviewerCode}`];
  return (findReviewStatus(status) ?? "").toLowerCase();
};
</script>

<style lang="scss" scoped>
.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
  @media screen and (max-width: $mobile-max-width) {
    bottom: 70px;
  }
}
</style>
