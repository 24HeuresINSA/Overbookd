<template>
  <v-card class="feedbacks">
    <v-card-title>Commentaires</v-card-title>
    <v-card-text class="feedbacks__listing">
      <v-data-table
        :headers="headers"
        :items="keyEvents"
        :items-per-page="-1"
        hide-default-footer
        disable-pagination
        no-data-text="Aucun commentaire"
      >
        <template #item.action="{ item }">
          <span class="action__emoji">{{ getActionEmoji(item.action) }}</span>
        </template>
        <template #item.by="{ item }">
          {{ formatUserNameWithNickname(item.by) }}
        </template>
        <template #item.at="{ item }">
          {{ formatDateWithMinutes(item.at) }}
        </template>
      </v-data-table>

      <v-textarea
        v-model="newFeedbackContent"
        label="Commentaire"
        rows="5"
        variant="outlined"
        hide-details
        @keydown.enter="publishFeedback"
      />
      <v-btn
        text="Ajouter un commentaire"
        color="primary"
        class="feedbacks__add"
        @click="publishFeedback"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {
  APPROVED,
  COMMENTED,
  CREATED,
  type FestivalActivity,
  type FestivalActivityKeyEvent,
  type FestivalTask,
  type FestivalTaskKeyEvent,
  READY_TO_REVIEW,
  REJECTED,
  RESET_REVIEW,
  ASSIGNMENT_STARTED,
  FORCED_UPDATE,
} from "@overbookd/festival-event";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import type { TableHeaders } from "~/utils/data-table/header";

type FestivalEvent = FestivalActivity | FestivalTask;
const props = defineProps({
  festivalEvent: {
    type: Object as PropType<FestivalEvent>,
    required: true,
  },
});

const headers: TableHeaders = [
  { title: "", value: "action", width: "15px" },
  { title: "Date", value: "at", width: "15%", sortable: true },
  { title: "Auteur", value: "by", width: "20%" },
  { title: "Commentaire", value: "description" },
];

const newFeedbackContent = ref<string>("");

type KeyEvent = FestivalActivityKeyEvent | FestivalTaskKeyEvent;
const keyEvents = computed<KeyEvent[]>(() => {
  const feedbacksAsKeyEvent: KeyEvent[] = props.festivalEvent.feedbacks.map(
    ({ author, publishedAt, content }) => ({
      at: publishedAt,
      description: content,
      by: author,
      action: COMMENTED,
    }),
  );
  return [...feedbacksAsKeyEvent, ...props.festivalEvent.history].toSorted(
    (first, second) => first.at.getTime() - second.at.getTime(),
  );
});

const emit = defineEmits(["publish"]);
const canPublishFeedback = computed<boolean>(
  () => newFeedbackContent.value.trim() !== "",
);
const publishFeedback = () => {
  if (!canPublishFeedback.value) return;
  emit("publish", newFeedbackContent.value);
  newFeedbackContent.value = "";
};

const getActionEmoji = (action: KeyEvent["action"]) => {
  switch (action) {
    case CREATED:
      return "🐣";
    case READY_TO_REVIEW:
      return "🕵️";
    case APPROVED:
      return "✅";
    case REJECTED:
      return "🛑";
    case COMMENTED:
      return "💬";
    case RESET_REVIEW:
      return "🌪️";
    case ASSIGNMENT_STARTED:
      return "🗓️";
    case FORCED_UPDATE:
      return "💪";
  }
};
</script>

<style lang="scss" scoped>
.feedbacks {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    .action__emoji {
      font-size: 1.2rem;
    }
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}
</style>
