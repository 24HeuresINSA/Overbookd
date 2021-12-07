<template>
  <v-card>
    <v-card-title>Historique de validation</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="comments"
        hide-default-footer
        :items-per-page="-1"
      >
        <template #[`item.time`]="{ item }">
          {{ new Date(item.time).toLocaleString() }}
        </template>
      </v-data-table>
      <v-textarea
        v-model="newComment"
        label="Commentaire?"
        dense
        rows="3"
      ></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="addComment">ajouter un commentaire</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { RepoFactory } from "../../../repositories/repoFactory";

export default {
  name: "CommentCard",
  props: {
    comments: {
      type: Array,
      default: () => [],
    },
    form: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    headers: [
      { text: "validateur", value: "validator" },
      { text: "sujet", value: "topic" },
      {
        text: "commentaire",
        value: "text",
      },
      { text: "date", value: "time" },
    ],
    newComment: undefined,
    store: undefined,
  }),
  mounted() {
    this.store = this.$accessor[this.form];
  },
  methods: {
    async addComment() {
      this.store.addComment({
        topic: "commentaire",
        text: this.newComment,
        time: new Date(),
        validator: this.$accessor.user.me.lastname,
      });
      // clean the input
      this.newComment = undefined;
      if (this.form === "FA") {
        await RepoFactory.faRepo.updateFA(this, this.$accessor.FA.mFA);
      } else if (this.form === "FT") {
        await RepoFactory.ftRepo.updateFT(this, this.$accessor.FT.mFT);
      }
    },
  },
};
</script>

<style scoped></style>
