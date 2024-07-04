<template>
  <h1>Fiches Activités</h1>
  <div class="activity fa">
    <v-card class="activity__listing">
      <v-data-table
        :headers="headers"
        :items="activities"
        :items-per-page="20"
        class="activity__table"
        :loading="loading"
        loading-text="Chargement des fiches activités..."
        no-data-text="Aucune fiche activité trouvée"
        hover
        @click:row="openActivity"
        @auxclick:row="openActivityInNewTab"
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

        <template #item.adherent="{ item }">
          {{ item.adherent ? formatUsername(item.adherent) : "" }}
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
        </template>

        <template #item.removal="{ item }">
          <v-btn
            v-show="canRemoveActivity"
            icon="mdi-delete"
            size="small"
            density="comfortable"
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
    @click="openNewActivityDialog"
  />

  <v-dialog v-model="isNewActivityDialogOpen" max-width="600">
    <NewFaCard @close="closeNewActivityDialog" />
  </v-dialog>

  <v-dialog v-model="isRemovalDialogOpen" max-width="600">
    <ConfirmationMessage
      confirm-color="error"
      @close="closeRemovalDialog"
      @confirm="removeActivity"
    >
      <template #title>
        Suppression de la FA #<strong>
          {{ activityToRemove?.id }}
        </strong>
      </template>
      <template #statement>
        Tu es sur le point de supprimer la FA
        <strong>{{ activityToRemove?.name }}.</strong>
        Es-tu sûr de faire ça ?
      </template>
      <template #confirm-btn-content>
        <v-icon left> mdi-delete </v-icon>Supprimer
      </template>
    </ConfirmationMessage>
  </v-dialog>
</template>

<script lang="ts" setup>
import { formatUsername } from "~/utils/user/user.utils";
import type { Team } from "@overbookd/http";
import { WRITE_FA } from "@overbookd/permission";
import type {
  PreviewFestivalActivity,
  Reviewer,
} from "@overbookd/festival-event";
import { findReviewStatus } from "~/utils/festival-event/festival-activity/festival-activity.filter";
import { isDraftPreview } from "~/utils/festival-event/festival-activity/festival-activity.model";
import type { TableHeaders } from "~/utils/data-table/header";

useHead({ title: "Fiches Activités" });

const router = useRouter();
const faStore = useFestivalActivityStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

const headers: TableHeaders = [
  { title: "Statut", value: "id", sortable: true },
  { title: "Validations", value: "reviews" },
  { title: "Nom", value: "name", sortable: true },
  { title: "Equipe", value: "team", sortable: true },
  { title: "Responsable", value: "adherent" },
  { title: "Suppression", value: "removal" },
];

const activities = computed<PreviewFestivalActivity[]>(
  () => faStore.activities.forAll,
);
const reviewers = computed<Team[]>(() => teamStore.faReviewers);

await teamStore.fetchFaReviewers();
const loading = ref(activities.value.length === 0);
faStore.fetchAllActivities().then(() => (loading.value = false));

const isNewActivityDialogOpen = ref(false);
const openNewActivityDialog = () => (isNewActivityDialogOpen.value = true);
const closeNewActivityDialog = () => (isNewActivityDialogOpen.value = false);

const openActivityInNewTab = (
  _: PointerEvent,
  { item }: { item: PreviewFestivalActivity },
) => {
  const { id } = { ...item };
  const activityRoute = router.resolve({ path: `/fa/${id}` });
  window.open(activityRoute.href, "_blank");
};
const openActivity = (
  event: PointerEvent,
  target: { item: PreviewFestivalActivity },
) => {
  if (event.ctrlKey) return openActivityInNewTab(event, target);
  const { id } = { ...target.item };
  router.push({ path: `/fa/${id}` });
};

const activityToRemove = ref<PreviewFestivalActivity | undefined>(undefined);
const isRemovalDialogOpen = ref(false);
const canRemoveActivity = computed<boolean>(() => userStore.can(WRITE_FA));
const openRemovalDialog = (activity: PreviewFestivalActivity) => {
  activityToRemove.value = activity;
  isRemovalDialogOpen.value = true;
};
const closeRemovalDialog = () => {
  isRemovalDialogOpen.value = false;
  activityToRemove.value = undefined;
};
const removeActivity = () => {
  if (!activityToRemove.value) return;
  faStore.remove(activityToRemove.value.id);
};

const getReviewerStatus = (
  activity: PreviewFestivalActivity,
  reviewer: Team,
): string => {
  if (isDraftPreview(activity)) return "";
  const reviewerCode = reviewer.code as Reviewer<"FA">;
  // eslint-disable-next-line security/detect-object-injection
  const status = activity.reviews[reviewerCode];
  return (findReviewStatus(status) ?? "").toLowerCase();
};
</script>

<style lang="scss" scoped>
#status {
  font-weight: bold;
}

.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
  @media screen and (max-width: $mobile-max-width) {
    bottom: 70px;
  }
}
</style>
