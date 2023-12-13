<template>
  <v-card class="feedbacks">
    <v-card-title>Commentaires</v-card-title>
    <v-card-text class="feedbacks__listing">
      <v-data-table
        :headers="headers"
        :items="feedbacksOrKeyEvents"
        :items-per-page="-1"
        hide-default-footer
        disable-pagination
      >
        <template #item.action="{ item }">
          <v-icon>{{ getActionIcon(item.action) }}</v-icon>
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
import { defineComponent } from "vue";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import {
  APPROVED,
  CREATED,
  KeyEvent,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/http";

type FaFeedbackCardData = {
  headers: Header[];
  newFeedbackContent: string;
};

type FeedbackOrKeyEvent = Omit<KeyEvent, "action"> & {
  action?: KeyEvent["action"];
};

export default defineComponent({
  name: "FaFeedbackCard",
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
    feedbacksOrKeyEvents(): FeedbackOrKeyEvent[] {
      const feedbacksAsKeyEvent =
        this.$accessor.festivalActivity.selectedActivity.feedbacks.map(
          ({ author, publishedAt, content }) => ({
            at: publishedAt,
            description: content,
            by: author,
          }),
        );

      return [
        ...feedbacksAsKeyEvent,
        ...this.$accessor.festivalActivity.selectedHistory,
      ].toSorted((first, second) => first.at.getTime() - second.at.getTime());
    },
    canPublishFeedback(): boolean {
      return this.newFeedbackContent.trim() !== "";
    },
  },
  methods: {
    async publishFeedback() {
      if (!this.canPublishFeedback) return;

      this.$accessor.festivalActivity.publishFeedback({
        content: this.newFeedbackContent,
      });
      this.newFeedbackContent = "";
    },
    getActionIcon(action?: FeedbackOrKeyEvent["action"]): string {
      switch (action) {
        case CREATED:
          return "mdi-plus-circle-outline";
        case READY_TO_REVIEW:
          return "mdi-book-open-outline";
        case APPROVED:
          return "mdi-checkbox-outline";
        case REJECTED:
          return "mdi-alert-octagon-outline";
        default:
          return "mdi-comment-outline";
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
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}
</style>
