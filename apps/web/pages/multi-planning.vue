<template>
  <DesktopPageTitle />

  <div class="multi-planning">
    <MultiPlanningFilterCard
      v-model:volunteers="selectedVolunteers"
      :loading="loading"
      @apply="onApplyFilters"
    />

    <OverMultiCalendar
      v-model="day"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :volunteers="volunteersForCalendar"
    >
      <template #volunteer-header="{ volunteer }">
        <MultiPlanningVolunteerResumeCalendarHeader
          :volunteer="volunteer"
          class="volunteer-header"
        />
      </template>
    </OverMultiCalendar>
  </div>
</template>

<script lang="ts" setup>
import { READ_FT } from "@overbookd/permission";
import { formatLocalDateTime } from "@overbookd/time";
import type { User } from "@overbookd/user";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import { toCalendarAssignment, toCalendarTask } from "~/utils/planning/event";
import { MultiPlanningParamsBuilder } from "~/utils/planning/multi-planning.filter";

useHead({ title: "Multi Planning" });

const DEFAULT_PAGE = 0;
const DEFAULT_ITEMS_PER_PAGE = 10;

const userStore = useUserStore();
const planningStore = usePlanningStore();
const configurationStore = useConfigurationStore();

const selectedVolunteers = ref<User[]>([]);

const canReadFt = computed<boolean>(() => userStore.can(READ_FT));

const volunteersForCalendar = computed<VolunteerForCalendar[]>(() =>
  planningStore.multiPlanningVolunteers.map((volunteer) => {
    const tasks = volunteer.tasks.map((task) =>
      toCalendarTask({ canReadFt: canReadFt.value })(task),
    );
    const assignments = volunteer.assignments.map(toCalendarAssignment);
    return {
      ...volunteer,
      events: [...tasks, ...assignments],
    };
  }),
);

const loading = ref<boolean>(false);

const onApplyFilters = async () => {
  loading.value = true;
  const volunteerIds = selectedVolunteers.value.map(({ id }) => id);
  await Promise.all([
    planningStore.getVolunteersForMultiPlanning(volunteerIds),
    updateQueryParams("volunteerIds", volunteerIds.map(String)),
  ]);
  loading.value = false;
};

const defaultDay = computed<Date>(() => configurationStore.eventStartDate);

const day = ref<Date>(defaultDay.value);
const page = ref<number>(DEFAULT_PAGE);
const itemsPerPage = ref<number>(DEFAULT_ITEMS_PER_PAGE);

const route = useRoute();
onMounted(async () => {
  await useUserStore().fetchVolunteers();
  const params = MultiPlanningParamsBuilder.getFromRouteQuery(route.query);
  if (params.volunteers) {
    selectedVolunteers.value = params.volunteers;
    onApplyFilters();
  }
  if (params.day) day.value = params.day;
  if (params.page) page.value = params.page;
  if (params.itemsPerPage) itemsPerPage.value = params.itemsPerPage;
});

watch(day, (d) =>
  updateQueryParams(
    "day",
    d.getTime() !== defaultDay.value.getTime()
      ? formatLocalDateTime(d)
      : undefined,
  ),
);
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

.multi-planning {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}
</style>
