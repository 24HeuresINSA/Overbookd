<template>
  <div class="volunteer-card">
    <div class="volunteer-card__actions">
      <div>
        <v-btn
          v-if="canChangeCandidate"
          icon="mdi-chevron-left"
          aria-label="Bénévole précédent"
          title="Bénévole précédent"
          variant="flat"
          rounded="pill"
          size="x-small"
          @click="previousCandidate"
        />
        <v-btn
          v-if="canRevokeCandidate"
          icon="mdi-account-minus"
          aria-label="Retirer le bénévole"
          title="Retirer le bénévole"
          color="error"
          rounded="pill"
          size="x-small"
          @click="revokeCandidate"
        />
        <v-btn
          v-if="canChangeCandidate"
          icon="mdi-chevron-right"
          aria-label="Bénévole suivant"
          title="Bénévole suivant"
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
import type {
  IDefineCandidate,
  IActAsFunnel,
  AssignableVolunteer,
} from "@overbookd/assignment";

const { candidate, funnel } = defineProps({
  candidate: {
    type: Object as PropType<AssignableVolunteer>,
    required: true,
  },
  funnel: {
    type: Object as PropType<IActAsFunnel>,
    required: true,
  },
});

const isLastCandidate = computed<boolean>(() => {
  const lastCandidate = funnel.candidates.at(-1);
  return lastCandidate?.id === candidate.id;
});
const canRevokeCandidate = computed<boolean>(
  () => funnel.canRevokeLastCandidate && isLastCandidate.value,
);
const canChangeCandidate = computed<boolean>(
  () => funnel.canChangeLastCandidate && isLastCandidate.value,
);

const funnelCandidate = computed<IDefineCandidate | undefined>(() => {
  return funnel.candidates.find((candidate) => candidate.id === candidate.id);
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
const temporaryAssign = (team: string, candidate: AssignableVolunteer) => {
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
