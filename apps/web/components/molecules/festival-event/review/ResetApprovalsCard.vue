<template>
  <ConfirmationMessage
    confirm-color="success"
    @close-dialog="closeDialog"
    @confirm="confirm"
  >
    <template #title>Réinitialiation des validations</template>
    <template #statement>
      Attention ! Modifier les instructions
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
  emits: ["confirm", "close-dialog"],
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>
