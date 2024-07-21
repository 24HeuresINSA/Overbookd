<template>
  <DialogCard @close="close">
    <template #title> Commencer l'affectation </template>
    <template #subtitle>
      Avant de commencer l'affectation il faut catégoriser la FT.
    </template>
    <template #content>
      <v-select
        v-model="category"
        label="Type de créneau"
        :items="categories"
        clearable
      />
      <v-switch
        v-model="topPriority"
        label="Est prioritaire dans l'affectation"
        color="primary"
      />
    </template>
    <template #actions>
      <v-btn
        text="Commencer l'affectation"
        prepend-icon="di-format-list-checkbox"
        color="primary"
        size="large"
        variant="elevated"
        @click="categorize"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Categorize } from "@overbookd/festival-event";
import {
  BAR,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
  type Category,
} from "@overbookd/festival-event-constants";

const categories = [BAR, RELOU, STATIQUE, MANUTENTION, FUN];

const category = ref<Category | undefined>(undefined);
const topPriority = ref<boolean>(false);

const emit = defineEmits(["close", "categorized"]);
const close = () => emit("close");

const categorize = () => {
  const categorize: Categorize = {
    category: category.value,
    topPriority: topPriority.value,
  };
  emit("categorized", categorize);
  close();
};
</script>
