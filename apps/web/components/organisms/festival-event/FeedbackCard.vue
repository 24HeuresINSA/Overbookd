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
        <template #no-data> Aucun commentaire </template>
      </v-data-table>

      <v-textarea
        v-model="newFeedbackContent"
        label="Commentaire"
        rows="5"
        outlined
        hide-details
        @keydown.enter="publishFeedback"
      />
      <v-btn color="primary" class="feedbacks__add" @click="publishFeedback">
        Ajouter un commentaire
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  APPROVED,
  COMMENTED,
  CREATED,
  FestivalActivity,
  FestivalActivityKeyEvent,
  FestivalTask,
  FestivalTaskKeyEvent,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/festival-event";
import { defineComponent } from "vue";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

type FestivalEvent = FestivalActivity | FestivalTask;
type KeyEvent = FestivalActivityKeyEvent | FestivalTaskKeyEvent;

type FaFeedbackCardData = {
  headers: Header[];
  newFeedbackContent: string;
};

export default defineComponent({
  name: "FeedbackCard",
  props: {
    festivalEvent: {
      type: Object as () => FestivalEvent,
      required: true,
    },
  },
  emits: ["publish"],
  data: (): FaFeedbackCardData => ({
    headers: [
      { text: "", value: "action", sortable: false, width: "15px" },
      { text: "Date", value: "at", width: "15%" },
      { text: "Auteur", value: "by", sortable: false, width: "20%" },
      { text: "Commentaire", value: "description", sortable: false },
    ],
    newFeedbackContent: "",
  }),
  computed: {
    keyEvents(): KeyEvent[] {
      const feedbacksAsKeyEvent: KeyEvent[] = this.festivalEvent.feedbacks.map(
        ({ author, publishedAt, content }) => ({
          at: publishedAt,
          description: content,
          by: author,
          action: COMMENTED,
        }),
      );

      return [...feedbacksAsKeyEvent, ...this.festivalEvent.history].toSorted(
        (first, second) => first.at.getTime() - second.at.getTime(),
      );
    },
    canPublishFeedback(): boolean {
      return this.newFeedbackContent.trim() !== "";
    },
  },
  methods: {
    publishFeedback() {
      if (!this.canPublishFeedback) return;
      this.$emit("publish", this.newFeedbackContent);
      this.newFeedbackContent = "";
    },
    getActionEmoji(action: KeyEvent["action"]): string {
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
      }
    },
    formatDateWithMinutes,
    formatUserNameWithNickname,
  },
});
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
