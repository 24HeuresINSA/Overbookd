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
        <template #[`item.created_at`]="{ item }">
          {{ new Date(item.created_at).toLocaleString() }}
        </template>
        <template #[`item.User_author`]="{ item }">
          {{
            item.User_author
              ? item.User_author.firstname + " " + item.User_author.lastname
              : " "
          }}
        </template>
      </v-data-table>
      <v-textarea
        v-model="newComment"
        label="Commentaire"
        dense
        rows="3"
        class="margin-top"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="addComment">ajouter un commentaire</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { RepoFactory } from "~/repositories/repoFactory";
import Vue from "vue";
import { safeCall } from "~/utils/api/calls";
import { subject_type, fa_comments } from "~/utils/models/FA";

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
    // eslint-disable-next-line vue/return-in-computed-property
    store(): any {
      if (this.form === "FA") {
        return this.$accessor.FA;
      } else if (this.form === "FT") {
        return this.$accessor.FT;
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    comments(): any {
      if (this.form === "FA") return this.$accessor.FA.mFA.fa_comments;
      // else if (this.form === "FT") return this.$accessor.FT.mFT.ft_comment;
    },
    me(): any {
      return this.$accessor.user.me;
    },
  },
  methods: {
    async addComment() {
      if (this.form == "FA") {
        const comment: fa_comments = {
          subject: subject_type.COMMENT,
          comment: this.newComment,
          author: this.me.id,
          team_id: 1, //TODO Change
          created_at: new Date(),
        };

        await this.store.addComment(comment);
        this.newComment = "";
      } else if (this.form === "FT") {
        /*const comment: ft_comment = {
          ft_id: +this.$route.params.fa,
          subject: CommentType.COMMENT,
          comment: this.newComment,
          author: this.me.id,
          created_at: new Date(),
        };

        this.store.addComment(comment);
        this.newComment = "";

        await safeCall(
          this.$store,
          RepoFactory.ftRepo.updateFT(this, this.$accessor.FT.mFT),
          "sent",
          "server"
        );*/
      }
    },
  },
});
</script>

<style scoped>
.margin-top {
  margin-top: 20px;
}
</style>
