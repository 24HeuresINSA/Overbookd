<template>
  <v-data-table
    :headers="tableHeaders"
    :items="inquiries"
    :items-per-page="-1"
    density="compact"
    :no-data-text="noDataMessage"
    :mobile="isMobile"
    disable-pagination
    hide-default-footer
  >
    <template #item.quantity="{ item }">
      {{ displayQuantity(item) }}
    </template>

    <template #item.drive="{ item }">
      <p v-if="cantLinkDrive">{{ gearDrive(item) || "" }}</p>
      <v-autocomplete
        v-else
        v-model:search="driveSearch"
        :model-value="gearDrive(item)"
        :items="sortedDrives"
        :custom-filter="customFilter"
        item-title="name"
        item-value="slug"
        density="compact"
        hide-details
        return-object
        @update:model-value="(drive) => linkDrive(item.slug, drive?.name)"
        @keydown.enter="selectFirstDrive(item)"
      />
    </template>

    <template #item.actions="{ item }">
      <v-btn
        icon="mdi-trash-can"
        size="small"
        variant="flat"
        @click="removeInquiry(item)"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import {
  type InquiryRequest,
  type InquiryOwner,
  BARRIERES,
  ELEC,
  type Drive,
  drives,
  type TimeWindow,
} from "@overbookd/festival-event";
import { SlugifyService } from "@overbookd/slugify";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const userStore = useUserStore();
const catalogGearStore = useCatalogGearStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  inquiries: {
    type: Array as PropType<InquiryRequest[]>,
    required: true,
  },
  timeWindows: {
    type: Array as PropType<TimeWindow[]>,
    required: true,
  },
  owner: {
    type: String as PropType<InquiryOwner>,
    required: true,
  },
  hideDrive: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Quantité", value: "quantity", width: "20%", sortable: true },
    { title: "Nom", value: "name", sortable: true },
  ];
  const driveHeader = {
    title: "Lieu de retrait",
    value: "drive",
    sortable: true,
    width: "35%",
  };
  const actionHeader = {
    title: "Actions",
    value: "actions",
    width: "15%",
  };
  return [
    ...baseHeaders,
    ...(props.hideDrive ? [] : [driveHeader]),
    ...(props.disabled ? [] : [actionHeader]),
  ];
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const noDataMessage = computed<string>(() => {
  switch (props.owner) {
    case BARRIERES:
      return "Aucune demande de barrières";
    case ELEC:
      return "Aucune demande d'équipement électrique";
    default:
      return "Aucune demande de matos";
  }
});

type DriveWithSlug = { name: Drive; slug: string };
const drivesWithSlug: DriveWithSlug[] = drives.map((drive) => ({
  name: drive,
  slug: SlugifyService.apply(drive),
}));
const sortedDrives = computed<DriveWithSlug[]>(() => {
  const selectedDrivesName = props.inquiries
    .map((inquiry) => gearDrive(inquiry)?.name)
    .filter((drive): drive is Drive => !!drive);
  const selectedSet = new Set(selectedDrivesName);

  const selectedDrives = drivesWithSlug.filter(({ name }) =>
    selectedSet.has(name),
  );
  const nonSelectedDrives = drivesWithSlug.filter(
    ({ name }) => !selectedSet.has(name),
  );
  return [...selectedDrives, ...nonSelectedDrives];
});

const cantLinkDrive = computed<boolean>(
  () => !userStore.isMemberOf(props.owner),
);

const displayQuantity = (inquiry: InquiryRequest): string => {
  const gear = catalogGearStore.gears.find(({ slug }) => slug === inquiry.slug);
  const isConsumable = gear?.isConsumable ?? false;
  if (!isConsumable) return `${inquiry.quantity}`;

  const timeWindowCount = props.timeWindows.length;
  if (timeWindowCount === 1) return `${inquiry.quantity}`;

  const total = timeWindowCount * inquiry.quantity;
  return `${total} (${timeWindowCount} créneaux X ${inquiry.quantity} demandes)`;
};
const gearDrive = (inquiry: InquiryRequest): DriveWithSlug | undefined => {
  return "drive" in inquiry
    ? sortedDrives.value?.find(({ name }) => name === inquiry.drive)
    : undefined;
};

const emit = defineEmits(["remove", "link-drive"]);
const removeInquiry = (inquiry: InquiryRequest) => emit("remove", inquiry);
const linkDrive = (slug: string, drive?: Drive) => {
  if (!drive) return;
  emit("link-drive", { slug, drive });
};

const driveSearch = ref<string>("");
const customFilter = (value: string, query: string) => {
  if (!query) return true;
  return value.toLowerCase().includes(query.toLowerCase());
};
const selectFirstDrive = (inquiry: InquiryRequest) => {
  const slugifiedSearch = SlugifyService.apply(driveSearch.value);
  const filteredDrives = sortedDrives.value.filter(({ name }) =>
    customFilter(name, slugifiedSearch),
  );
  const firstDrive = filteredDrives.at(0);
  if (!firstDrive) return;

  linkDrive(inquiry.slug, firstDrive.name);

  if (!(document.activeElement instanceof HTMLElement)) return;
  document.activeElement.blur();
};
</script>
