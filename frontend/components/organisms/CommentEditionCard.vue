<template>
  <v-card>
    <v-card-title> Commentaire 💬 </v-card-title>
    <v-card-text>
      <v-textarea v-model="comment" :counter="maxCharacters" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text :disabled="isInvalidComment" @click="saveComment">
        Sauvegarder
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { maxCharacters } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "CommentEditionCard",
  data: () => ({
    comment: "",
    maxCharacters: 200,
  }),
  computed: {
    savedComment(): string {
      return this.$accessor.user.me.comment ?? "";
    },
    isInvalidComment(): boolean {
      return maxCharacters(this.maxCharacters)(this.comment) !== true;
    },
  },
  watch: {
    savedComment() {
      this.comment = this.savedComment;
    },
  },
  mounted() {
    this.comment = this.savedComment;
  },
  methods: {
    saveComment() {
      this.$accessor.user.updateComment(this.comment);
    },
  },
});
</script>
