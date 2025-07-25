<template>
  <v-card class="feedbacks">
    <v-card-title>Commentaires</v-card-title>
    <v-card-text class="feedbacks__listing">
      <v-data-table
        :headers="headers"
        :items="keyEvents"
        :items-per-page="-1"
        no-data-text="Aucun commentaire"
        :mobile="isMobile"
        hide-default-footer
        disable-pagination
      >
        <template #item.action="{ item }">
          <span class="action__emoji">{{ getActionEmoji(item.action) }}</span>
        </template>
        <template #item.by="{ item }">
          {{ buildUserNameWithNickname(item.by) }}
        </template>
        <template #item.at="{ item }">
          {{ formatDateWithMinutes(item.at) }}
        </template>
        <template #item.description="{ item }">
          <span class="feedback-text">{{ item.description }}</span>
        </template>
      </v-data-table>

      <v-textarea
        v-model="newFeedbackContent"
        label="Commentaire"
        rows="5"
        variant="outlined"
        hide-details
        @keydown.enter="handleEnterKeyDown"
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
  type FestivalActivity,
  type FestivalActivityKeyEvent,
  type FestivalTask,
  type FestivalTaskKeyEvent,
} from "@overbookd/festival-event";
import {
  APPROVED,
  ASSIGNMENT_STARTED,
  COMMENTED,
  CREATED,
  FORCED_UPDATE,
  READY_TO_REVIEW,
  REJECTED,
  RESET_REVIEW,
} from "@overbookd/festival-event-constants";
import { formatDateWithMinutes } from "@overbookd/time";
import { buildUserNameWithNickname } from "@overbookd/user";
import type { TableHeaders } from "~/utils/vuetify/component-props";

type FestivalEvent = FestivalActivity | FestivalTask;
const props = defineProps({
  festivalEvent: {
    type: Object as PropType<FestivalEvent>,
    required: true,
  },
});

const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "", value: "action", width: "15px" },
  { title: "Date", value: "at", width: "15%", sortable: true },
  { title: "Auteur", value: "by", width: "20%" },
  { title: "Commentaire", value: "description" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

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

const handleEnterKeyDown = (event: KeyboardEvent) => {
  if (event.shiftKey) return;
  event.preventDefault();
  publishFeedback();
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

.feedback-text {
  white-space: pre-wrap;
}
</style>
