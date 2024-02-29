<template>
  <ConfirmationMessage
    confirm-color="success"
    @close-dialog="closeDialog"
    @confirm="reset"
  >
    <template #title>Réinitialiation des validations</template>
    <template #statement>
      Attention ! Modifier ce champ
      <strong>réinitialisera les validations déjà effectuées</strong>. Es-tu sûr
      de vouloir continuer ?
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-plus-circle-outline </v-icon>Continuer
    </template>
  </ConfirmationMessage>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";

export default defineComponent({
  name: "ResetApprovalsCard",
  components: { ConfirmationMessage },
  emits: ["reset", "close-dialog"],
  methods: {
    reset() {
      this.$emit("reset");
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>
