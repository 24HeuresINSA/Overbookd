<template>
  <v-card>
    <v-card-title>Historique de validation</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="comments"
        hide-default-footer
        :items-per-page="-1"
        sort-by="createdAt"
      >
        <template #[`item.User_author`]="{ item }">
          {{
            item.User_author
              ? item.User_author.firstname + " " + item.User_author.lastname
              : me.firstname + " " + me.lastname
          }}
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ formatDateString(item.created_at) }}
        </template>
      </v-data-table>
      <v-textarea
        v-model="newComment"
        label="Commentaire"
        rows="3"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="addComment">ajouter un commentaire</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Feedback, SubjectType } from "~/utils/models/feedback";

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
      { text: "Auteur", value: "User_author" },
      { text: "Sujet", value: "subject" },
      { text: "Commentaire", value: "comment" },
      { text: "Date", value: "createdAt" },
    ],
    newComment: "",
  }),
  computed: {
    comments(): Feedback[] {
      return this.$accessor.FT.mFT.ftComments;
    },
    me(): any {
      return this.$accessor.user.me;
    },
  },
  methods: {
    async addComment() {
      if (!this.newComment) return;
      if (this.form == "FA") {
        const comment: Feedback = {
          subject: SubjectType.COMMENT,
          comment: this.newComment,
          author: this.me.id,
          createdAt: new Date(),
        };

        //await this.$accessor.FT.addComment({ comment, defaultAuthor: this.me });
        this.newComment = "";
      }
    },
    formatDateString(date: string) {
      const displayOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("fr", displayOptions).format(
        new Date(date)
      );
    },
  },
});
</script>

<style scoped></style>
