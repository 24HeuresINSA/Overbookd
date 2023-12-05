<template>
  <v-form class="inquiry-form">
    <v-text-field
      v-model="quantity"
      type="number"
      label="Quantité"
      :rules="[rules.number, rules.min]"
      class="inquiry-form__quantity"
    />
    <SearchGear v-model="gear" class="inquiry-form__search" />
    <v-btn
      rounded
      color="primary"
      class="inquiry-form__btn"
      :disabled="!canAddInquiry"
      @click="addInquiry"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchGear from "~/components/atoms/field/search/SearchGear.vue";
import { Gear } from "~/utils/models/catalog.model";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

type FaInquiryFormData = InputRulesData & {
  gear: Gear | null;
  quantity: number;
};

export default defineComponent({
  name: "FaInquiryForm",
  components: { SearchGear },
  data: (): FaInquiryFormData => ({
    gear: null,
    quantity: 1,

    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    canAddInquiry(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
  },
  methods: {
    clearInquiryForm() {
      this.gear = null;
      this.quantity = 1;
    },
    addInquiry(): void {
      if (!this.canAddInquiry) return;
      const inquiry = {
        slug: this.gear?.slug ?? "",
        quantity: +this.quantity,
      };
      this.$emit("add", inquiry);
      this.clearInquiryForm();
    },
  },
});
</script>

<style lang="scss" scoped>
.inquiry-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0;
  &__btn {
    margin-left: 20px;
    margin-bottom: 30px;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__quantity,
    &__search {
      width: 100%;
    }
    &__btn {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
