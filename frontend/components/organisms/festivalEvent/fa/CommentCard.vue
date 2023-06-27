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
        <template #[`item.author`]="{ item }">
          {{
            item.author
              ? item.author.firstname + " " + item.author.lastname
              : me.firstname + " " + me.lastname
          }}
        </template>
        <template #[`item.createdAt`]="{ item }">
          {{ formatDate(item.createdAt) }}
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
import { FaFeedback } from "~/utils/models/FA";
import { SubjectType } from "~/utils/models/feedback";
import { MyUserInformation } from "~/utils/models/user";

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
      { text: "Auteur", value: "author" },
      { text: "Sujet", value: "subject" },
      { text: "Commentaire", value: "comment" },
      { text: "Date", value: "createdAt" },
    ],
    newComment: "",
  }),
  computed: {
    store(): any {
      if (this.form === "FA") return this.$accessor.FA;
      return this.$accessor.FT;
    },
    comments(): FaFeedback[] {
      if (this.form === "FA") return this.$accessor.FA.mFA.faFeedbacks ?? [];
      return [];
    },
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
  },
  methods: {
    async addComment() {
      if (!this.newComment) return;
      if (this.form == "FA") {
        const comment: FaFeedback = {
          subject: SubjectType.COMMENT,
          comment: this.newComment,
          authorId: this.me.id,
          createdAt: new Date(),
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
