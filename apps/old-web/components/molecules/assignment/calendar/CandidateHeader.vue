<template>
  <div class="calendar-header">
    <div class="calendar-header__action">
      <v-btn
        v-if="canRevokeCandidate"
        icon
        color="red"
        @click="revokeCandidate"
      >
        <v-icon>mdi-account-minus</v-icon>
      </v-btn>
      <v-tooltip top max-width="20rem">
        <template #activator="{ on, attrs }">
          <v-icon v-show="candidate.note" small v-bind="attrs" v-on="on">
            mdi-note
          </v-icon>
        </template>
        <span>{{ candidate.note }}</span>
      </v-tooltip>
      <v-tooltip top max-width="20rem">
        <template #activator="{ on, attrs }">
          <v-icon v-show="candidate.comment" small v-bind="attrs" v-on="on">
            mdi-comment
          </v-icon>
        </template>
        <span>{{ candidate.comment }}</span>
      </v-tooltip>
    </div>
    <div class="calendar-header__candidate">
      <v-btn v-if="canChangeCandidate" icon @click="previousCandidate">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <AssignmentVolunteerResumeCalendarHeader
        :volunteer="candidate"
        class="volunteer-resume"
      />
      <v-btn v-if="canChangeCandidate" icon @click="nextCandidate">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IActAsFunnel, IDefineCandidate } from "@overbookd/assignment";
import AssignmentVolunteerResumeCalendarHeader from "~/components/molecules/assignment/resume/AssignmentVolunteerResumeCalendarHeader.vue";

export default defineComponent({
  name: "AssignmentCalendarHeader",
  components: {
    AssignmentVolunteerResumeCalendarHeader,
  },
  props: {
    candidate: { type: Object as () => IDefineCandidate, required: true },
    funnel: { type: Object as () => IActAsFunnel, required: true },
  },
  emits: ["revoke", "next", "previous"],
  computed: {
    isLastCandidate(): boolean {
      const lastCandidate = this.funnel.candidates.at(-1);
      return lastCandidate?.id === this.candidate.id;
    },
    canChangeCandidate(): boolean {
      return this.funnel.canChangeLastCandidate && this.isLastCandidate;
    },
    canRevokeCandidate(): boolean {
      return this.funnel.canRevokeLastCandidate && this.isLastCandidate;
    },
  },
  methods: {
    revokeCandidate() {
      this.$emit("revoke");
    },
    previousCandidate() {
      this.$emit("previous");
    },
    nextCandidate() {
      this.$emit("next");
    },
  },
});
</script>

<style lang="scss" scoped>
.calendar-header {
  &__candidate {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    .volunteer-resume {
      width: 100%;
    }
  }
  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    gap: 3px;
  }
}
</style>
