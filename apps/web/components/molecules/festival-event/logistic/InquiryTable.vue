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
      <v-text-field
        v-if="currentInquiryUpdate === item"
        v-model="newQuantity"
        type="number"
        :rules="[isNumber, min(1)]"
        density="compact"
        hide-details
      />
      <span v-else>{{ displayQuantity(item) }}</span>
    </template>

    <template #item.drive="{ item }">
      <p v-if="cantLinkDrive">{{ gearDrive(item) || "" }}</p>
      <v-autocomplete
        v-else
        :id="`drive-${item.slug}`"
        v-model:search="driveSearch"
        :model-value="gearDrive(item)"
        :items="sortedDrives"
        :custom-filter="slugifiedFilter"
        density="compact"
        hide-details
        @update:model-value="(drive) => linkDrive(item.slug, drive)"
        @keydown.enter="selectFirstDrive(item)"
      />
    </template>

    <template #item.actions="{ item }">
      <div v-if="currentInquiryUpdate === item" class="edit-actions">
        <v-btn
          icon="mdi-close"
          aria-label="Annuler les modifications"
          title="Annuler les modifications"
          color="error"
          size="small"
          density="comfortable"
          rounded="pill"
          @click="currentInquiryUpdate = null"
        />
        <v-btn
          icon="mdi-check"
          aria-label="Valider les modifications"
          title="Valider les modifications"
          color="success"
          size="small"
          density="comfortable"
          rounded="pill"
          @click="updateInquiry(item)"
        />
      </div>
      <div v-else>
        <v-btn
          icon="mdi-pencil"
          aria-label="Éditer la demande de matos"
          title="Éditer la demande de matos"
          size="small"
          variant="flat"
          @click="openInquiryUpdateForm(item)"
        />
        <v-btn
          icon="mdi-trash-can"
          aria-label="Supprimer la demande de matos"
          title="Supprimer la demande de matos"
          size="small"
          variant="flat"
          @click="removeInquiry(item)"
        />
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import {
  type InquiryRequest,
  type InquiryOwner,
  type Drive,
  drives,
  type TimeWindow,
} from "@overbookd/festival-event";
import { slugifiedFilter } from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { isNumber, min } from "~/utils/rules/input.rules";
import { BARRIERES, LOG_ELEC } from "@overbookd/team-constants";

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
    case LOG_ELEC:
      return "Aucune demande d'équipement électrique";
    default:
      return "Aucune demande de matos";
  }
});

const sortedDrives = computed<Drive[]>(() => {
  const selectedDrives = props.inquiries
    .map((inquiry) => gearDrive(inquiry))
    .filter((drive): drive is Drive => !!drive);
  const selectedSet = new Set(selectedDrives);
  const nonSelectedDrives = drives.filter((drive) => !selectedSet.has(drive));
  return [...selectedSet, ...nonSelectedDrives];
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
const gearDrive = (inquiry: InquiryRequest): Drive | undefined => {
  return "drive" in inquiry ? inquiry.drive : undefined;
};

const currentInquiryUpdate = ref<InquiryRequest | null>(null);
const newQuantity = ref<number>(1);
const openInquiryUpdateForm = (inquiry: InquiryRequest) => {
  currentInquiryUpdate.value = inquiry;
  newQuantity.value = inquiry.quantity;
};

const emit = defineEmits(["update", "remove", "link-drive"]);
const updateInquiry = (inquiry: InquiryRequest) => {
  if (currentInquiryUpdate.value?.slug !== inquiry.slug) {
    currentInquiryUpdate.value = null;
    return;
  }
  emit("update", inquiry, +newQuantity.value);
  currentInquiryUpdate.value = null;
};
const removeInquiry = (inquiry: InquiryRequest) => emit("remove", inquiry);
const linkDrive = (slug: string, drive?: Drive) => {
  if (!drive) return;
  emit("link-drive", { slug, drive });
};

const driveSearch = ref<string>("");
const selectFirstDrive = (inquiry: InquiryRequest) => {
  const filteredDrives = sortedDrives.value.filter(
    (drive) => slugifiedFilter(drive, driveSearch.value) !== -1,
  );
  const firstDrive = filteredDrives.at(0);
  if (!firstDrive) return;

  linkDrive(inquiry.slug, firstDrive);

  if (!(document.activeElement instanceof HTMLElement)) return;
  document.activeElement.blur();
};
</script>

<style>
.edit-actions .v-btn {
  margin: 0 6px;
}
</style>
