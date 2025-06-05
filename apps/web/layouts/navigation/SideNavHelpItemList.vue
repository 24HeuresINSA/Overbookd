<template>
  <v-list class="navigation-list help-items" density="compact" nav>
    <v-divider class="divider" :thickness="2" />
    <v-list-item
      prepend-icon="mdi-help-circle"
      class="navigation-item"
      :class="{ 'unfolded-item': !isFolded }"
      link
      @click="openAskQuestionDialog"
    >
      <template #title>
        <span class="navigation-item__title">Besoin d'aide ?</span>
      </template>
    </v-list-item>
    <v-list-item
      prepend-icon="mdi-bug"
      class="navigation-item"
      :class="{ 'unfolded-item': !isFolded }"
      link
      @click="openReportBugDialog"
    >
      <template #title>
        <span class="navigation-item__title">Signaler un bug</span>
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
defineProps({
  isFolded: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["ask-question", "report-bug"]);
const openAskQuestionDialog = () => emit("ask-question");
const openReportBugDialog = () => emit("report-bug");
</script>

<style lang="scss" scoped>
@use "./side-nav-list.scss" as *;

.help-items {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
