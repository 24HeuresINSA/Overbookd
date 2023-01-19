<template>
  <v-card>
    <v-card-title>Historique de validation</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="feedbacks"
        hide-default-footer
        :items-per-page="-1"
        sort-by="createdAt"
      >
        <template #[`item.author`]="{ item }">
          {{ getAuthorName(item.author) }}
        </template>
        <template #[`item.createdAt`]="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>
      </v-data-table>
      <v-textarea v-model="comment" label="Commentaire" rows="3"></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="addFeedback">ajouter un commentaire</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Feedback, SubjectType } from "~/utils/models/feedback";
import { DisplayedUser, User } from "~/utils/models/user";
import { formatDate } from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "FeedbackCard",
  props: {
    form: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    headers: [
      { text: "Auteur", value: "author" },
      { text: "Sujet", value: "subject" },
      { text: "Commentaire", value: "comment" },
      { text: "Date", value: "createdAt" },
    ],
    comment: "",
  }),
  computed: {
    feedbacks(): Feedback[] {
      return this.$accessor.FT.mFT.feedbacks;
    },
    me(): any {
      return this.$accessor.user.me;
    },
  },
  methods: {
    async addFeedback() {
      if (!this.comment) return;
      const author: User = {
        id: this.me.id,
        firstname: this.me.firstname,
        lastname: this.me.lastname,
      };

      const feedback: Feedback = {
        subject: SubjectType.COMMENT,
        comment: this.comment,
        author,
        createdAt: new Date(),
      };

      await this.$accessor.FT.addFeedback(feedback);
      this.comment = "";
    },
    getAuthorName(user?: DisplayedUser) {
      if (!user) return `${this.me.firstname} ${this.me.lastname}`;
      return `${user.firstname} ${user.lastname}`;
    },
    formatDate(date: Date | string): string {
      return formatDate(date);
    },
  },
});
</script>

<style scoped></style>
