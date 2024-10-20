<template>
  <v-navigation-drawer
    v-model:rail="isFolded"
    :model-value="isDesktop"
    expand-on-hover
    rail-width="60"
    width="300"
    floating
    :mobile="false"
    class="desktop-only"
    @update:rail="unfocusOnSearch"
  >
    <SideNavSearchField
      v-model:search-input="searchInput"
      v-model:search-value="searchValue"
      :is-folded="isFolded"
    />
    <SideNavPageList :search="searchValue" :is-folded="isFolded" />
    <SideNavHelpItemList
      :is-folded="isFolded"
      @ask-question="openAskQuestionDialog"
      @report-bug="openReportBugDialog"
    />
  </v-navigation-drawer>

  <v-dialog v-model="askQuestion" max-width="600">
    <AskQuestionDialogCard @close="closeAskQuestionDialog" />
  </v-dialog>

  <v-dialog v-model="reportBug" max-width="800">
    <BugReportDialogCard @close="closeReportBugDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
import SideNavSearchField from "./SideNavSearchField.vue";
import SideNavPageList from "./SideNavPageList.vue";
import SideNavHelpItemList from "./SideNavHelpItemList.vue";
import {
  shouldFlipContent,
  shouldUnflipContent,
} from "~/utils/easter-egg/flip-content";

const navigationBadgeStore = useNavigationBadgeStore();
const layoutStore = useLayoutStore();

onMounted(() => navigationBadgeStore.fetchAll());

const isDesktop = computed<boolean>(() => layoutStore.isDesktop);

const isFolded = ref<boolean>(true);
const searchValue = ref<string | undefined>(undefined);

const searchInput = ref<HTMLInputElement | null>(null);
const unfocusOnSearch = () => searchInput.value?.blur();

const emit = defineEmits(["flip-content", "unflip-content"]);
watch(searchValue, (newValue) => {
  if (shouldFlipContent(newValue)) return emit("flip-content");
  if (shouldUnflipContent(newValue)) return emit("unflip-content");
});

const askQuestion = ref<boolean>(false);
const openAskQuestionDialog = () => (askQuestion.value = true);
const closeAskQuestionDialog = () => (askQuestion.value = false);

const reportBug = ref<boolean>(false);
const openReportBugDialog = () => (reportBug.value = true);
const closeReportBugDialog = () => (reportBug.value = false);
</script>
