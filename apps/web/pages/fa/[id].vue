<template>
  <div class="activity fa">
    <FestivalEventSidebar festival-event="FA" class="sidebar" />
    <article class="container fa">
      <FaGeneralCard id="general" />
      <FaInChargeCard id="in-charge" />
      <SignaCard id="signa" />
      <SecurityCard id="security" />
      <SupplyCard id="supply" />
      <FaInquiryCard id="inquiry" />
      <FeedbackCard
        id="feedback"
        :festival-event="selectedActivity"
        @publish="publishFeedback"
      />
      <ChildFtCard id="ft" />
    </article>
  </div>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";

const route = useRoute();
const router = useRouter();
const faStore = useFestivalActivityStore();

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const activityIdFromUrl = computed<number>(() => +route.params.id);
const name = computed<string>(() => selectedActivity.value.general.name);
const headTitle = computed<string>(() => {
  const displayedName = name.value ? ` - ${name.value}` : "";
  return `FA ${activityIdFromUrl.value}${displayedName}`;
});

onMounted(async () => {
  await faStore.fetchActivity(activityIdFromUrl.value);
  if (selectedActivity.value.id !== activityIdFromUrl.value) {
    router.push({ path: "/fa" });
  }
});

useHead({ title: headTitle.value });
watch(name, () => (document.title = headTitle.value));

const publishFeedback = (content: string) => {
  faStore.publishFeedback({ content });
};
</script>

<style lang="scss" scoped>
$sidebar-margin: calc($card-margin * 2);
$sidebar-width: calc(350px + $sidebar-margin);

.activity {
  display: flex;
  overflow: auto;
  scroll-behavior: smooth;
  gap: $card-gap;
}

.sidebar {
  position: fixed;
  width: $sidebar-width;
  height: fit-content;
}

.container {
  display: flex;
  flex-direction: column;
  width: calc(100% - $sidebar-width - $card-gap);
  margin-left: $sidebar-width + $card-gap;
  gap: $card-gap;
}

@media only screen and (max-width: $mobile-max-width) {
  .activity {
    flex-direction: column;
    overflow-y: scroll;
    height: auto;
  }

  .sidebar {
    position: relative;
    width: 100%;
    margin: unset;
    margin-bottom: 20px;
  }

  .container {
    margin: unset;
    padding: unset;
  }
}
</style>
