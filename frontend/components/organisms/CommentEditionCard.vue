<template>
  <v-card>
    <v-card-title> Commentaire 💬 </v-card-title>
    <v-card-text>
      <v-textarea v-model="comment" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text @click="saveComment"> Sauvegarder </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "CommentEditionCard",
  data: () => ({
    comment: "",
  }),
  computed: {
    savedComment(): string {
      return this.$accessor.user.me.comment ?? "";
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
