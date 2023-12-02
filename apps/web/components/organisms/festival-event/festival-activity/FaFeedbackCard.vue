<template>
  <v-card>
    <v-card-title>Commentaires</v-card-title>
    <v-card-text>
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
          {{ formatDate(item.publishedAt) }}
        </template>
        <template #no-data> Aucun commentaire </template>
      </v-data-table>

      <v-textarea v-model="newFeedbackContent" label="Commentaire" rows="3" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="!canPublishFeedback" text @click="addFeedback">
        Ajouter un commentaire
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDate } from "~/utils/date/date.utils";
import { Feedback } from "@overbookd/festival-activity";
import { Header } from "~/utils/models/data-table.model";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

type FaFeedbackCardData = {
  headers: Header[];
  newFeedbackContent: string;
};

export default Vue.extend({
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
    async addFeedback() {
      if (!this.canPublishFeedback) return;

      this.$accessor.festivalActivity.publishFeedback({
        content: this.newFeedbackContent,
      });
      this.newFeedbackContent = "";
    },
    formatDate,
    formatUserNameWithNickname,
  },
});
</script>
