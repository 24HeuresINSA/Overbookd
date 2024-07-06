<template>
  <div class="activity fa">
    <FestivalEventSidebar festival-event="FA" class="sidebar" />
    <article class="container fa">
      <FaGeneralCard id="general" />
      <FaInChargeCard id="in-charge" />
      <SecurityCard id="security" />
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

await faStore.fetchActivity(activityIdFromUrl.value);
if (selectedActivity.value.id !== activityIdFromUrl.value) {
  router.push({ path: "/fa" });
}

useHead({
  title: `FA ${selectedActivity.value.id} - ${selectedActivity.value.general.name}`,
});

const publishFeedback = (content: string) => {
  faStore.publishFeedback({ content });
};
</script>

<style lang="scss" scoped>
$sidebar-width: 350px;

.activity {
  display: flex;
  overflow: auto;
  scroll-behavior: smooth;
}

.sidebar {
  position: fixed;
  width: $sidebar-width;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: calc(100vw - #{$sidebar-width} - 90px);
  padding: 12px;
  margin-left: $sidebar-width;
  gap: 20px;
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
    overflow: visible;
    margin: unset;
    padding: unset;
  }
}
</style>
