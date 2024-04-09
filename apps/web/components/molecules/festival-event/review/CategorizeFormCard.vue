<template>
  <v-card class="categorize-card">
    <v-btn class="categorize-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="categorize-card__title">
      <h2>Commencer l'affectation</h2>
    </v-card-title>
    <v-card-subtitle>
      <p>Avant de commencer l'affectation il faut catégoriser la FT.</p>
    </v-card-subtitle>
    <v-card-text>
      <v-select
        v-model="category"
        label="Type de créneau"
        :items="categories"
        clearable
      />
      <v-switch
        v-model="topPriority"
        label="Est prioritaire dans l'affectation"
      />
    </v-card-text>
    <v-card-actions class="categorize-card__actions">
      <v-btn color="primary" large @click="categorize">
        <v-icon left> mdi-format-list-checkbox</v-icon>
        Commencer l'affectation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Categorize } from "@overbookd/festival-event";
import {
  BAR,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import { defineComponent } from "vue";

export default defineComponent({
  name: "CategorizeFormCard",
  emits: ["close-dialog", "categorized"],
  data: (): Categorize => ({
    category: undefined,
    topPriority: false,
  }),
  computed: {
    categories() {
      return [BAR, RELOU, STATIQUE, MANUTENTION, FUN];
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    categorize() {
      const categorize = {
        category: this.category,
        topPriority: this.topPriority,
      };
      this.$emit("categorized", categorize);
      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
.categorize-card {
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
