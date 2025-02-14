<template>
  <v-chip-group id="reviewers" column>
    <v-chip
      v-for="reviewer of reviewers"
      :key="reviewer.code"
      :class="getReviewerStatus(reviewer)"
      size="small"
    >
      <v-icon size="small"> {{ reviewer.icon }} </v-icon>
    </v-chip>
  </v-chip-group>
</template>

<script lang="ts" setup>
import {
  NOT_ASKING_TO_REVIEW,
  type PreviewFestivalActivity,
  type PreviewFestivalTask,
  type Reviewer,
} from "@overbookd/festival-event";
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

onMounted(() => {
  if (reviewers.value.length > 0) return;
  if (isActivity.value) return teamStore.fetchFaReviewers();
  teamStore.fetchFtReviewers();
});

const getReviewerStatus = (reviewer: Team): string => {
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
): string => {
  if (isActivityDraftPreview(activity))
    return NOT_ASKING_TO_REVIEW.toLowerCase();
  const reviewerCode = reviewer.code as Reviewer<"FA">;
  const status = activity.reviews[`${reviewerCode}`];
  return status.toLowerCase();
};
const getTaskReviewerStatus = (
  task: PreviewFestivalTask,
  reviewer: Team,
): string => {
  if (isTaskDraftPreview(task)) return NOT_ASKING_TO_REVIEW.toLowerCase();
  const reviewerCode = reviewer.code as Reviewer<"FT">;
  const status = task.reviews[`${reviewerCode}`];
  return status.toLowerCase();
};
</script>
