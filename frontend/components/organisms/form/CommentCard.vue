<template>
  <v-card>
    <v-card-title>Historique de validation</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="comments"
        hide-default-footer
        :items-per-page="-1"
        sort-by="time"
      >
        <template #[`item.time`]="{ item }">
          {{ new Date(item.time).toLocaleString() }}
        </template>
      </v-data-table>
      <v-textarea
        v-model="newComment"
        label="Commentaire"
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

<script lang="ts">
import { RepoFactory } from "~/repositories/repoFactory";
import { Header } from "~/utils/models/Data";
import Vue from "vue";
import { FormComment } from "~/utils/models/Comment";
import { safeCall } from "~/utils/api/calls";

declare interface Data {
  headers: Header[];
  newComment: string;
}

export default Vue.extend({
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
  data(): Data {
    return {
      headers: [
        { text: "Validateur", value: "validator" },
        { text: "Sujet", value: "topic" },
        {
          text: "Commentaire",
          value: "text",
        },
        { text: "Date", value: "time" },
      ],
      newComment: "",
    };
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    store(): any {
      if (this.form === "FA") {
        return this.$accessor.FA;
      } else if (this.form === "FT") {
        return this.$accessor.FT;
      }
    },
  },
  methods: {
    async addComment() {
      const comment: FormComment = {
        topic: "commentaire",
        text: this.newComment,
        time: new Date(),
        validator: `${this.$accessor.user.me.firstname} ${this.$accessor.user.me.lastname}`,
      };
      this.store.addComment(comment);
      // clean the input
      this.newComment = "";
      if (this.form === "FA") {
        await safeCall(
          this.$store,
          RepoFactory.faRepo.updateFA(this, this.$accessor.FA.mFA),
          "sent",
          "server"
        );
      } else if (this.form === "FT") {
        await safeCall(
          this.$store,
          RepoFactory.ftRepo.updateFT(this, this.$accessor.FT.mFT),
          "sent",
          "server"
        );
      }
    },
  },
});
</script>

<style scoped></style>
