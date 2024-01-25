<template>
  <v-data-table
    :headers="dataTableHeaders"
    :items="inquiries"
    item-key="key"
    :items-per-page="-1"
    disable-pagination
    hide-default-footer
    dense
  >
    <template #item.quantity="{ item }">
      {{ displayQuantity(item) }}
    </template>

    <template #item.drive="{ item }">
      <p v-if="cantLinkDrive">{{ item.drive }}</p>
      <v-autocomplete
        v-else
        :value="item.drive"
        :items="drives"
        @change="(drive) => linkDrive(item.slug, drive)"
      />
    </template>

    <template #item.actions="{ item }">
      <div v-if="!disabled" class="action">
        <v-btn icon @click="removeInquiry(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
    <template #no-data>{{ noDataMessage }}</template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  FestivalActivity,
  InquiryRequest,
  InquiryOwner,
  BARRIERES,
  ELEC,
  Drive,
  drives,
} from "@overbookd/festival-event";
import { Header } from "~/utils/models/data-table.model";

type InquiryTableData = {
  headers: Header[];
  actionHeader: Header;
};

export default defineComponent({
  name: "InquiryTable",
  props: {
    inquiries: {
      type: Array as () => InquiryRequest[],
      required: true,
    },
    owner: {
      type: String as () => InquiryOwner,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: (): InquiryTableData => ({
    headers: [
      { text: "Quantité", value: "quantity", width: "20%" },
      { text: "Nom", value: "name" },
      { text: "Lieux de retrait", value: "drive", width: "150px" },
    ],
    actionHeader: {
      text: "Actions",
      value: "actions",
      width: "100px",
      sortable: false,
    },
  }),
  computed: {
    inquiry(): FestivalActivity["inquiry"] {
      return this.$accessor.festivalActivity.selectedActivity.inquiry;
    },
    drives(): Drive[] {
      return drives;
    },
    cantLinkDrive(): boolean {
      return !this.$accessor.user.isMemberOf(this.owner);
    },
    noDataMessage(): string {
      switch (this.owner) {
        case BARRIERES:
          return "Aucune demande de barrières";
        case ELEC:
          return "Aucune demande d'équipement électrique";
        default:
          return "Aucune demande de matos";
      }
    },
    dataTableHeaders(): Header[] {
      return this.disabled
        ? this.headers
        : [...this.headers, this.actionHeader];
    },
  },
  methods: {
    displayQuantity(inquiry: InquiryRequest): string {
      const gear = this.$accessor.catalogGear.gears.find(
        ({ slug }) => slug === inquiry.slug,
      );
      const isConsumable = gear?.isConsumable ?? false;
      if (!isConsumable) return `${inquiry.quantity}`;

      const timeWindowCount = this.inquiry.timeWindows.length;
      if (timeWindowCount === 1) return `${inquiry.quantity}`;

      const total = timeWindowCount * inquiry.quantity;
      return `${total} (${timeWindowCount} créneaux X ${inquiry.quantity} demandes)`;
    },
    addInquiry(inquiry: InquiryRequest) {
      this.$emit("add", inquiry);
    },
    removeInquiry(inquiry: InquiryRequest) {
      this.$emit("remove", inquiry);
    },
    linkDrive(slug: string, drive: Drive) {
      this.$accessor.festivalActivity.linkDrive({ slug, drive });
    },
  },
});
</script>
