<template>
  <div class="borrow">
    <h1>Fiche Emprunt n°{{ borrowId }}</h1>
    <v-text-field
      :value="selectedBorrow.lender"
      label="Prêteur"
      @change="updateLender"
    />

    <h2>Période de disponibilité</h2>
    <div class="borrow-period">
      <DateTimeField
        :date="selectedBorrow.availableOn"
        label="Date de disponibilité"
        :boxed="false"
        @change="updateAvailableOn"
      />
      <DateTimeField
        :date="selectedBorrow.unavailableOn"
        label="Date de retour"
        :boxed="false"
        @change="updateUnavailableOn"
      />
    </div>

    <h2>Matos à emprunter</h2>
    <div class="gear-request-form">
      <InquiryFormFields
        class="gear-request-form__fields"
        :gear="gear"
        :quantity="quantity"
        @update:gear="updateGear"
        @update:quantity="updateQuantity"
      />
      <v-btn
        rounded
        color="primary"
        class="gear-request-form__btn"
        :disabled="!canAddGearRequest"
        @click="addGearRequest"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="selectedBorrow.gears"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
    >
      <template #item.remove="{ item }">
        <v-btn icon @click="removeGearRequest(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </template>
      <template #no-data> Aucune emprunt de matos </template>
    </v-data-table>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import InquiryFormFields from "~/components/molecules/festival-event/logistic/inquiry/InquiryFormFields.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { Borrow, GearRequest } from "@overbookd/logistic";
import { Gear } from "~/utils/models/catalog.model";
import { Header } from "~/utils/models/data-table.model";

type BorrowDetailsData = {
  headers: Header[];
  gear: Gear | null;
  quantity: number;
};

export default defineComponent({
  name: "BorrowFormDetails",
  components: { DateTimeField, InquiryFormFields, SnackNotificationContainer },
  data: (): BorrowDetailsData => ({
    gear: null,
    quantity: 1,
    headers: [
      { text: "Quantité", value: "quantity" },
      { text: "Nom", value: "name" },
      { text: "Supprimer", value: "remove", sortable: false, align: "center" },
    ],
  }),
  computed: {
    selectedBorrow(): Borrow {
      return this.$accessor.borrow.selected;
    },
    borrowId(): number {
      return +this.$route.params.borrowId;
    },
    canAddGearRequest(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
  },
  async mounted() {
    await this.$accessor.borrow.fetchOne(this.borrowId);
    if (this.selectedBorrow.id === this.borrowId) return;

    const message =
      "Oups 😬 J'ai l'impression que cette Fiche Emprunt n'existe pas...";
    this.$accessor.notif.pushNotification({ message });
    this.$router.push({ path: "/logistic/borrow" });
  },
  methods: {
    updateLender(lender: string) {
      this.$accessor.borrow.plan({ lender });
    },
    updateAvailableOn(availableOn: Date) {
      this.$accessor.borrow.plan({ availableOn });
    },
    updateUnavailableOn(unavailableOn: Date) {
      this.$accessor.borrow.plan({ unavailableOn });
    },
    addGearRequest() {
      if (!this.gear) return;
      this.$accessor.borrow.addGearRequest({
        slug: this.gear.slug,
        quantity: this.quantity,
      });
    },
    removeGearRequest(gear: GearRequest) {
      this.$accessor.borrow.removeGearRequest(gear.slug);
    },
    updateGear(gear: Gear) {
      this.gear = gear;
    },
    updateQuantity(quantity: number) {
      this.quantity = quantity;
    },
  },
});
</script>

<style lang="scss" scoped>
.borrow {
  margin: 0 20px;
  h2 {
    margin-top: 10px;
    font-size: 1.3em;
  }
}

.gear-request-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-top: 10px;
  margin-bottom: 0;
  &__fields {
    width: 100%;
  }
  &__btn {
    margin: 10px 0 30px 20px;
  }
  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__btn {
      margin: 0;
      width: 100%;
    }
  }
}

.borrow-period {
  display: flex;
  gap: 1em;
  @media screen and (max-width: 650px) {
    flex-direction: column;
    gap: 0.2em;
  }
}
</style>
