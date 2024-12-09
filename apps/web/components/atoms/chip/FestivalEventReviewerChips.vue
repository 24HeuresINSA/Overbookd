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
import type {
  FestivalEventIdentifier,
  PreviewFestivalActivity,
  PreviewFestivalTask,
  Reviewer,
} from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { isDraftPreview as isActivityDraftPreview } from "~/utils/festival-event/festival-activity/festival-activity.model";
import { findReviewStatus } from "~/utils/festival-event/festival-event.utils";
import { isDraftPreview as isTaskDraftPreview } from "~/utils/festival-event/festival-task/festival-task.model";

const teamStore = useTeamStore();

const props = defineProps({
  type: {
    type: String as PropType<FestivalEventIdentifier>,
    required: true,
  },
  festivalEvent: {
    type: Object as PropType<PreviewFestivalActivity | PreviewFestivalTask>,
    required: true,
  },
});

const reviewers = computed<Team[]>(() =>
  props.type === "FA" ? teamStore.faReviewers : teamStore.ftReviewers,
);

onMounted(() => {
  if (reviewers.value.length > 0) return;
  if (props.type === "FA") return teamStore.fetchFaReviewers();
  teamStore.fetchFtReviewers();
});

const getReviewerStatus = (reviewer: Team): string => {
  if (props.type === "FA") {
    return getActivityReviewerStatus(
      props.festivalEvent as PreviewFestivalActivity,
      reviewer,
    );
  }
  return getTaskReviewerStatus(
    props.festivalEvent as PreviewFestivalTask,
    reviewer,
  );
};

const getActivityReviewerStatus = (
  activity: PreviewFestivalActivity,
  reviewer: Team,
): string => {
  if (isActivityDraftPreview(activity)) return "";
  const reviewerCode = reviewer.code as Reviewer<"FA">;
  const status = activity.reviews[`${reviewerCode}`];
  return (findReviewStatus(status) ?? "").toLowerCase();
};
const getTaskReviewerStatus = (
  task: PreviewFestivalTask,
  reviewer: Team,
): string => {
  if (isTaskDraftPreview(task)) return "";
  const reviewerCode = reviewer.code as Reviewer<"FT">;
  const status = task.reviews[`${reviewerCode}`];
  return (findReviewStatus(status) ?? "").toLowerCase();
};
</script>
