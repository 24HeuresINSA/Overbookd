<template>
  <v-data-table
    :headers="headers"
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

    <template #item.actions="{ item }">
      <div v-if="!disabled">
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
} from "@overbookd/festival-activity";
import { Header } from "~/utils/models/data-table.model";

type InquiryTableData = {
  headers: Header[];
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
      { text: "Actions", value: "actions", width: "10%" },
    ],
  }),
  computed: {
    inquiry(): FestivalActivity["inquiry"] {
      return this.$accessor.festivalActivity.selectedActivity.inquiry;
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
  },
  methods: {
    displayQuantity(inquiry: InquiryRequest): string {
      const gear = this.$accessor.catalogGear.gears.find(
        ({ slug }) => slug === inquiry.slug,
      );
      const isConsumable = gear?.isConsumable ?? false;
      if (!isConsumable) return `${inquiry.quantity}`;

      const timeWindowCount = this.inquiry.timeWindows.length;
      const total = timeWindowCount * inquiry.quantity;
      return `${total} (${timeWindowCount} créneaux X ${inquiry.quantity} demandes)`;
    },
    addInquiry(inquiry: InquiryRequest) {
      this.$emit("add", inquiry);
    },
    removeInquiry(inquiry: InquiryRequest) {
      this.$emit("remove", inquiry);
    },
  },
});
</script>
