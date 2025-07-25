<template>
  <DesktopPageTitle />
  <div class="need-help">
    <TimelineFormCards
      v-model:loading="loading"
      class="need-help__item"
      @apply="onApplyFilters"
    />
    <NeedHelpVolunteerListCard
      :volunteers="volunteers"
      :loading="loading"
      class="need-help__item mobile-only"
    />
    <OverMultiCalendar
      v-show="!loading && volunteers.length > 0"
      v-model="day"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :volunteers="volunteersForCalendar"
      :event-to-add="eventToAdd"
      class="need-help__item desktop-only"
    >
      <template #volunteer-header="{ volunteer }">
        <NeedHelpVolunteerResumeCalendarHeader
          :volunteer="volunteer"
          class="volunteer-header"
        />
      </template>
    </OverMultiCalendar>
    <p
      v-if="!loading && volunteers.length === 0"
      class="no-volunteers desktop-only"
    >
      Aucun bénévole disponible sur ce créneau
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { HelpingVolunteer } from "@overbookd/http";
import {
  type CalendarEvent,
  createCalendarEvent,
} from "~/utils/calendar/event";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import { NeedHelpPaginationBuilder } from "~/utils/need-help/need-help.pagination";

useHead({ title: "Besoin d'aide" });

const DEFAULT_PAGE = 0;
const DEFAULT_ITEMS_PER_PAGE = 10;

const needHelpStore = useNeedHelpStore();

const start = computed<Date>(() => needHelpStore.start);
const end = computed<Date>(() => needHelpStore.end);
const day = ref<Date>(start.value);

const volunteers = computed<HelpingVolunteer[]>(
  () => needHelpStore.filteredVolunteers,
);
const volunteersForCalendar = computed<VolunteerForCalendar[]>(() =>
  volunteers.value.map((volunteer) => ({
    ...volunteer,
    assignments: volunteer.assignments.map(createCalendarEvent),
  })),
);

const loading = ref<boolean>(false);

const onApplyFilters = () => {
  day.value = needHelpStore.start;
};

const eventToAdd = computed<CalendarEvent>(() => {
  return createCalendarEvent({
    name: "Viens m'aider",
    start: start.value,
    end: end.value,
    color: "tertiary",
  });
});

const page = ref<number>(DEFAULT_PAGE);
const itemsPerPage = ref<number>(DEFAULT_ITEMS_PER_PAGE);

const route = useRoute();
onMounted(() => {
  const pagination = NeedHelpPaginationBuilder.getFromRouteQuery(route.query);
  if (pagination.page) page.value = pagination.page;
  if (pagination.itemsPerPage) itemsPerPage.value = pagination.itemsPerPage;
});

watch(page, (p) =>
  updateQueryParams("page", p !== DEFAULT_PAGE ? p : undefined),
);
watch(itemsPerPage, (ipp) =>
  updateQueryParams(
    "itemsPerPage",
    ipp !== DEFAULT_ITEMS_PER_PAGE ? ipp : undefined,
  ),
);
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.need-help {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
  &__item {
    width: 100%;
  }
}

.no-volunteers {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 2rem;
}
</style>
