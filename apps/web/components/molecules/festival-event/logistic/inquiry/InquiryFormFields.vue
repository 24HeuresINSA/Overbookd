<template>
  <v-form class="inquiry-form">
    <v-text-field
      :value="quantity"
      type="number"
      label="Quantité"
      :rules="[rules.number, rules.min]"
      class="inquiry-form__quantity"
      :disabled="disabled"
      @change="updateQuantity"
    />
    <SearchGear
      :gear="gear"
      class="inquiry-form__search"
      :ponctual-usage="ponctualUsage"
      :disabled="disabled"
      @change="updateGear"
    />
  </v-form>
</template>

<script lang="ts">
import { CatalogGear } from "@overbookd/http";
import { defineComponent } from "vue";
import SearchGear from "~/components/atoms/field/search/SearchGear.vue";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

export default defineComponent({
  name: "InquiryFormFields",
  components: { SearchGear },
  props: {
    gear: {
      type: Object as () => CatalogGear | null,
      default: () => null,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    ponctualUsage: {
      type: Boolean,
      default: () => undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:gear", "update:quantity"],
  data: (): InputRulesData => ({
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    canConfirmInquiry(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
  },
  methods: {
    updateGear(gear: CatalogGear) {
      this.$emit("update:gear", gear);
    },
    updateQuantity(quantity: number) {
      this.$emit("update:quantity", +quantity);
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
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__quantity,
    &__search {
      width: 100%;
    }
  }
}
</style>
