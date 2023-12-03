<template>
  <v-card class="feedbacks">
    <v-card-title>Commentaires</v-card-title>
    <v-card-text class="feedbacks__listing">
      <v-data-table
        :headers="headers"
        :items="feedbacks"
        :items-per-page="-1"
        hide-default-footer
        disable-pagination
      >
        <template #item.author="{ item }">
          {{ formatUserNameWithNickname(item.author) }}
        </template>
        <template #item.publishedAt="{ item }">
          {{ formatDateWithMinutes(item.publishedAt) }}
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
import { Feedback } from "@overbookd/festival-activity";
import { Header } from "~/utils/models/data-table.model";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

type FaFeedbackCardData = {
  headers: Header[];
  newFeedbackContent: string;
};

export default defineComponent({
  name: "FaFeedbackCard",
  data: (): FaFeedbackCardData => ({
    headers: [
      { text: "Date", value: "publishedAt", width: "15%" },
      { text: "Auteur", value: "author", sortable: false, width: "20%" },
      { text: "Commentaire", value: "content", sortable: false },
    ],
    newFeedbackContent: "",
  }),
  computed: {
    feedbacks(): Feedback[] {
      return this.$accessor.festivalActivity.selectedActivity.feedbacks;
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
