<template>
  <v-card>
    <v-card-title>Historique de validation</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="comments"
        hide-default-footer
        :items-per-page="-1"
        sort-by="created_at"
      >
        <template #[`item.User_author`]="{ item }">
          {{
            item.User_author
              ? item.User_author.firstname + " " + item.User_author.lastname
              : me.firstname + " " + me.lastname
          }}
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ formatDate(item.created_at) }}
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
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { fa_comments } from "~/utils/models/FA";
import { SubjectType } from "~/utils/models/feedback";

export default Vue.extend({
  name: "CommentCard",
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
      { text: "Date", value: "created_at" },
    ],
    newComment: "",
  }),
  computed: {
    store(): any {
      if (this.form === "FA") return this.$accessor.FA;
      return this.$accessor.FT;
    },
    comments(): fa_comments[] {
      if (this.form === "FA") return this.$accessor.FA.mFA.fa_comments ?? [];
      return [];
    },
    me(): any {
      return this.$accessor.user.me;
    },
  },
  methods: {
    async addComment() {
      if (!this.newComment) return;
      if (this.form == "FA") {
        const comment: fa_comments = {
          subject: SubjectType.COMMENT,
          comment: this.newComment,
          author: this.me.id,
          created_at: new Date(),
        };

        await this.store.addComment({ comment, defaultAuthor: this.me });
        this.newComment = "";
      }
    },
    formatDate(date: string) {
      return formatDateWithMinutes(date);
    },
  },
});
</script>

<style scoped></style>
