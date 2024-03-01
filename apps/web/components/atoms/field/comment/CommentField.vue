<template>
  <v-textarea
    :value="comment"
    class="comment-input"
    label="Commentaire"
    hint="Exemple: Je ne peux pas porter de charges lourdes mais j'adore m'occuper des animations pour enfants. La musique c'est pas trop mon délire donc je suis chaud de faire plein de trucs pour m'éviter les concerts."
    persistent-hint
    @change="updateComment"
  >
    <template #prepend>
      Dis nous en commentaire si tu as des contraintes physiques, de la
      motivation à revendre pour nous aider un maximum ou encore un préféré
      parmi les responsables bénévoles 😏
    </template>
  </v-textarea>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommentField",
  model: {
    prop: "comment",
    event: "update:comment",
  },
  props: {
    comment: {
      type: String,
      default: () => "",
    },
  },
  emits: ["update:comment"],
  methods: {
    updateComment(comment: string | null) {
      this.$emit("update:comment", comment);
    },
  },
});
</script>

<style lang="scss" scoped>
.comment-input {
  flex-direction: column;
  gap: 7px;
}
</style>
