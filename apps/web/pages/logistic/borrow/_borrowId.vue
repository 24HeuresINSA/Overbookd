<template>
  <div>
    <h1>Fiche Emprunt n°{{ borrowId }}</h1>
    <v-text-field
      :value="selectedBorrow.lender"
      label="Prêteur"
      @change="updateLender"
    />
    <DateTimeField
      :value="selectedBorrow.availableOn"
      label="Date de disponibilité"
      @change="updateAvailableOn"
    />
    <DateTimeField
      :value="selectedBorrow.unavailableOn"
      label="Date de retour"
      @change="updateUnavailableOn"
    />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { Borrow } from "@overbookd/logistic";
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default defineComponent({
  name: "BorrowSheetDetails",
  components: { DateTimeField, SnackNotificationContainer },
  computed: {
    selectedBorrow(): Borrow {
      return this.$accessor.borrow.selected;
    },
    borrowId(): number {
      return +this.$route.params.borrowId;
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
  },
});
</script>
