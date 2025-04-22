<template>
  <div class="volunteer-card">
    <div class="volunteer-card__actions">
      <div>
        <v-btn
          v-if="canChangeCandidate"
          icon="mdi-chevron-left"
          variant="flat"
          rounded="pill"
          size="x-small"
          @click="previousCandidate"
        />
        <v-btn
          v-if="canRevokeCandidate"
          icon="mdi-account-minus"
          color="error"
          rounded="pill"
          size="x-small"
          @click="revokeCandidate"
        />
        <v-btn
          v-if="canChangeCandidate"
          icon="mdi-chevron-right"
          variant="flat"
          rounded="pill"
          size="x-small"
          @click="nextCandidate"
        />
      </div>
      <div class="teams">
        <TeamChip
          v-for="team of assignableTeams"
          :key="team"
          :team="team"
          show-hidden
          size="small"
          clickable
          :class="{
            'not-selected': isNotAssignedAs(team),
          }"
          @click="temporaryAssign(team, candidate)"
        />
      </div>
    </div>
    <div>
      <AssignmentVolunteerResumeCalendarHeader
        :volunteer="candidate"
        class="volunteer-resume"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IDefineCandidate, IActAsFunnel } from "@overbookd/assignment";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";

const props = defineProps({
  candidate: {
    type: Object as PropType<VolunteerForCalendar>,
    required: true,
  },
  funnel: {
    type: Object as PropType<IActAsFunnel>,
    required: true,
  },
});

const isLastCandidate = computed<boolean>(() => {
  const lastCandidate = props.funnel.candidates.at(-1);
  return lastCandidate?.id === props.candidate.id;
});
const canRevokeCandidate = computed<boolean>(
  () => props.funnel.canRevokeLastCandidate && isLastCandidate.value,
);
const canChangeCandidate = computed<boolean>(
  () => props.funnel.canChangeLastCandidate && isLastCandidate.value,
);

const funnelCandidate = computed<IDefineCandidate | undefined>(() => {
  return props.funnel.candidates.find(
    (candidate) => candidate.id === props.candidate.id,
  );
});
const assignableTeams = computed<string[]>(() => {
  if (!funnelCandidate.value) return [];
  return funnelCandidate.value.assignableTeams;
});
const isNotAssignedAs = (team: string) => {
  return funnelCandidate.value?.as !== team;
};

const emit = defineEmits(["revoke", "next", "previous", "temporary-assign"]);
const revokeCandidate = () => emit("revoke");
const previousCandidate = () => emit("previous");
const nextCandidate = () => emit("next");
const temporaryAssign = (team: string, candidate: VolunteerForCalendar) => {
  emit("temporary-assign", team, candidate);
};
</script>

<style lang="scss" scoped>
.volunteer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    margin-top: 4px;
  }
}

.not-selected {
  opacity: 0.4;
}
</style>
