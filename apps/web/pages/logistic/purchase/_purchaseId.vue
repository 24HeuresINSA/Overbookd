<template>
  <div class="purchase">
    <h1>Fiche Achat n°{{ purchaseId }}</h1>
    <v-text-field
      :value="selectedPurchase.seller"
      label="Vendeur"
      @change="updateSeller"
    />

    <h2>Date de disponibilité</h2>
    <div class="purchase-date">
      <DateTimeField
        :date="selectedPurchase.availableOn"
        label="Date de disponibilité"
        :boxed="false"
        @change="updateAvailableOn"
      />
    </div>

    <h2>Matos à acheter</h2>
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
      :items="selectedPurchase.gears"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
    >
      <template #item.remove="{ item }">
        <v-btn icon @click="removeGearRequest(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </template>
      <template #no-data> Aucun achat de matos </template>
    </v-data-table>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { CatalogGear } from "@overbookd/http";
import { GearRequest } from "@overbookd/logistic";
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import InquiryFormFields from "~/components/molecules/festival-event/logistic/inquiry/InquiryFormFields.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { Header } from "~/utils/data-table/header";

type PurchaseDetailsData = {
  headers: Header[];
  gear: CatalogGear | null;
  quantity: number;
};

export default defineComponent({
  name: "PurchaseFormDetails",
  components: { DateTimeField, InquiryFormFields, SnackNotificationContainer },
  data(): PurchaseDetailsData {
    return {
      headers: [
        { text: "Quantité", value: "quantity" },
        { text: "Nom", value: "name" },
        {
          text: "Supprimer",
          value: "remove",
          sortable: false,
          align: "center",
        },
      ],
      gear: null,
      quantity: 1,
    };
  },
  computed: {
    selectedPurchase() {
      return this.$accessor.purchase.selected;
    },
    purchaseId() {
      return +this.$route.params.purchaseId;
    },
    canAddGearRequest() {
      return this.gear !== null && this.quantity > 0;
    },
  },
  async mounted() {
    await this.$accessor.purchase.fetchOne(this.purchaseId);
    if (this.selectedPurchase.id === this.purchaseId) return;

    const message =
      "Oups 😬 J'ai l'impression que cette Fiche Achat n'existe pas...";
    this.$accessor.notif.pushNotification({ message });
    this.$router.push({ path: "/logistic/purchase" });
  },
  methods: {
    updateSeller(seller: string) {
      this.$accessor.purchase.plan({ seller });
    },
    updateAvailableOn(availableOn: Date) {
      this.$accessor.purchase.plan({ availableOn });
    },
    addGearRequest() {
      if (!this.gear) return;
      this.$accessor.purchase.addGearRequest({
        slug: this.gear.slug,
        quantity: this.quantity,
      });
    },
    removeGearRequest(gear: GearRequest) {
      this.$accessor.purchase.removeGearRequest(gear.slug);
    },
    updateGear(gear: CatalogGear) {
      this.gear = gear;
    },
    updateQuantity(quantity: number) {
      this.quantity = quantity;
    },
  },
});
</script>

<style lang="scss" scoped>
.purchase {
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

.purchase-date {
  display: flex;
  gap: 1em;
  @media screen and (max-width: 650px) {
    flex-direction: column;
    gap: 0.2em;
  }
}
</style>
