<template>
  <v-card class="reject-card">
    <v-btn class="reject-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="reject-card__title">
      <h2>Rejeter une activité</h2>
    </v-card-title>
    <v-card-subtitle>
      <p>
        Tu es sur le point de rejeter l'activité
        <strong>{{ activityName }}</strong> .
      </p>
      <p>Il faut que tu expliques ce qui ne va pas dedans.</p>
    </v-card-subtitle>
    <v-card-text>
      <v-textarea
        v-model="reason"
        label="Explication"
        rows="3"
        outlined
        hide-details
        @keydown.enter="reject"
      />
    </v-card-text>
    <v-card-actions class="reject-card__actions">
      <v-btn :disabled="isReasonEmpty" color="primary" large @click="reject">
        <v-icon left> mdi-alert-octagon-outline</v-icon>
        Rejeter la FA
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

type AskRejectReasonFormCardData = {
  reason: string;
};

export default defineComponent({
  name: "AskRejectReasonFormCard",
  emits: ["close-dialog", "rejected"],
  data: (): AskRejectReasonFormCardData => ({
    reason: "",
  }),
  computed: {
    isReasonEmpty(): boolean {
      return this.reason.trim() === "";
    },
    activityName(): string {
      return this.$accessor.festivalActivity.selectedActivity.general.name;
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    reject(event: Event) {
      if (this.isReasonEmpty) return;
      event.preventDefault();

      this.$emit("rejected", { reason: this.reason });
      this.reason = "";
      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
.reject-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  p {
    margin-bottom: 5px;
  }
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
