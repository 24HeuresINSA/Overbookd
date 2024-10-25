<template>
  <div class="activity fa">
    <FestivalEventSidebar festival-event="FA" class="sidebar" />
    <article class="container fa">
      <FaGeneralCard id="general" @open:calendar="openCalendar" />
      <FaInChargeCard id="in-charge" />
      <SignaCard id="signa" />
      <SecurityCard id="security" />
      <SupplyCard id="supply" />
      <FaInquiryCard id="inquiry" @open:calendar="openCalendar" />
      <FeedbackCard
        id="feedback"
        :festival-event="selectedActivity"
        @publish="publishFeedback"
      />
      <ChildFtCard id="ft" />
    </article>

    <v-dialog v-model="isCalendarDialogOpen" max-width="1000">
      <DialogCard without-actions @close="closeCalendar">
        <template #title> Créneaux de l'activité </template>
        <template #content>
          <OverCalendar v-model="calendarMarker" :events="allTimeWindows" />
        </template>
      </DialogCard>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";
import { FA_URL } from "@overbookd/web-page";
import type { CalendarEvent } from "~/utils/calendar/event";

const route = useRoute();
const faStore = useFestivalActivityStore();
const configurationStore = useConfigurationStore();

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
    navigateTo(FA_URL);
  }
});

useHead({ title: headTitle.value });
watch(name, () => (document.title = headTitle.value));

const publishFeedback = (content: string) => {
  faStore.publishFeedback({ content });
};

const isCalendarDialogOpen = ref<boolean>(false);
const openCalendar = () => (isCalendarDialogOpen.value = true);
const closeCalendar = () => (isCalendarDialogOpen.value = false);

const allTimeWindows = computed<CalendarEvent[]>(() => {
  const inquiryEvents: CalendarEvent[] =
    selectedActivity.value.inquiry.timeWindows.map(({ start, end }) => ({
      start,
      end,
      name: "Matos",
      color: "secondary",
    }));
  const generalEvents: CalendarEvent[] =
    selectedActivity.value.general.timeWindows.map(({ start, end }) => ({
      start,
      end,
      name: "Animation",
      color: "primary",
    }));
  return [...inquiryEvents, ...generalEvents];
});

const calendarMarker = ref<Date>(
  allTimeWindows.value.at(0)?.start ?? configurationStore.eventStartDate,
);
</script>

<style lang="scss" scoped>
$sidebar-margin: calc($card-margin * 2);
$side-nav-width: calc(350px + $sidebar-margin);

.activity {
  display: flex;
  overflow: auto;
  scroll-behavior: smooth;
  gap: $card-gap;
}

.sidebar {
  position: fixed;
  width: $side-nav-width;
  max-height: calc(
    100vh - $header-height - 2 * $desktop-content-vertical-padding - 10px
  );
}

.container {
  display: flex;
  flex-direction: column;
  width: calc(100% - $side-nav-width - $card-gap);
  margin-left: $side-nav-width + $card-gap;
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
    width: 100%;
    margin: unset;
    padding: unset;
  }
}
</style>
