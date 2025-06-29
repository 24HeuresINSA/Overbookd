<template>
  <v-chip-group id="reviewers" column>
    <v-chip
      v-for="reviewer of reviewers"
      :key="reviewer.code"
      :class="getReviewerStatus(reviewer).toLowerCase()"
      :aria-label="getReviewerTitle(reviewer)"
      :title="getReviewerTitle(reviewer)"
      size="small"
    >
      <v-icon :icon="reviewer.icon" size="small" />
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts" setup>
import {
  type PreviewFestivalActivity,
  type PreviewFestivalTask,
  type Reviewer,
} from "@overbookd/festival-event";
import {
  NOT_ASKING_TO_REVIEW,
  PAS_DE_RELECTURE,
  reviewLabels,
  type Review,
} from "@overbookd/festival-event-constants";
import type { Team } from "@overbookd/team";
import { isDraftPreview as isActivityDraftPreview } from "~/utils/festival-event/festival-activity/festival-activity.utils";
import { isDraftPreview as isTaskDraftPreview } from "~/utils/festival-event/festival-task/festival-task.utils";

const teamStore = useTeamStore();

const props = defineProps({
  preview: {
    type: Object as PropType<PreviewFestivalActivity | PreviewFestivalTask>,
    required: true,
  },
});

const isActivity = computed<boolean>(() => "adherent" in props.preview);

const reviewers = computed<Team[]>(() =>
  isActivity.value ? teamStore.faReviewers : teamStore.ftReviewers,
);

const getReviewerTitle = (reviewer: Team): string => {
  const statusLabel: string =
    reviewLabels.get(getReviewerStatus(reviewer)) ?? PAS_DE_RELECTURE;
  return `${reviewer.name} : ${statusLabel}`;
};

const getReviewerStatus = (reviewer: Team): Review => {
  if (isActivity.value) {
    return getActivityReviewerStatus(
      props.preview as PreviewFestivalActivity,
      reviewer,
    );
  }
  return getTaskReviewerStatus(props.preview as PreviewFestivalTask, reviewer);
};

const getActivityReviewerStatus = (
  activity: PreviewFestivalActivity,
  reviewer: Team,
): Review => {
  if (isActivityDraftPreview(activity)) return NOT_ASKING_TO_REVIEW;
  const reviewerCode = reviewer.code as Reviewer<"FA">;
  const status = activity.reviews[`${reviewerCode}`];
  return status;
};
const getTaskReviewerStatus = (
  task: PreviewFestivalTask,
  reviewer: Team,
): Review => {
  if (isTaskDraftPreview(task)) return NOT_ASKING_TO_REVIEW;
  const reviewerCode = reviewer.code as Reviewer<"FT">;
  const status = task.reviews[`${reviewerCode}`];
  return status;
};
</script>
