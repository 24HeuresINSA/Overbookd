<template>
  <v-card>
    <v-card-title>Historique de validation</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="sortedFeedbacks"
        hide-default-footer
        :items-per-page="-1"
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
import Vue from 'vue';
import { formatDate } from '~/utils/date/dateUtils';
import {
  FaFeedback,
  FaFeedbackSubjectType,
  Feedback,
  FtFeedback,
  FtFeedbackSubjectType,
} from '~/utils/models/feedback';
import { DisplayedUser, MyUserInformation, User } from '~/utils/models/user';

export default Vue.extend({
  name: 'FeedbackCard',
  props: {
    form: {
      type: String,
      default: () => 'FA',
    },
  },
  data: () => ({
    headers: [
      { text: 'Auteur', value: 'author' },
      { text: 'Sujet', value: 'subject' },
      { text: 'Commentaire', value: 'comment' },
      { text: 'Date', value: 'createdAt' },
    ],
    comment: '',
  }),
  computed: {
    sortedFeedbacks(): Feedback[] {
      const feedbacks: (FaFeedback | FtFeedback)[] = this.isFa
        ? [...this.faFeedbacks]
        : [...this.fatFeedbacks];
      return feedbacks.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    },
    faFeedbacks(): FaFeedback[] {
      return this.$accessor.fa.mFA.feedbacks ?? [];
    },
    fatFeedbacks(): FtFeedback[] {
      return this.$accessor.ft.mFT.feedbacks;
    },
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    isFa(): boolean {
      return this.form === 'FA';
    },
  },
  methods: {
    async addFeedback() {
      const trimedComment = this.comment.trim();
      if (!trimedComment) return;

      const author: User = {
        id: this.me.id,
        firstname: this.me.firstname,
        lastname: this.me.lastname,
      };

      if (this.isFa) {
        const feedback: FaFeedback = {
          subject: FaFeedbackSubjectType.COMMENT,
          comment: trimedComment,
          author,
          createdAt: new Date(),
        };
        await this.$accessor.fa.addFeedback(feedback);
      } else {
        const feedback: FtFeedback = {
          subject: FtFeedbackSubjectType.COMMENT,
          comment: trimedComment,
          author,
          createdAt: new Date(),
        };
        await this.$accessor.ft.addFeedback(feedback);
      }
      this.comment = '';
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
