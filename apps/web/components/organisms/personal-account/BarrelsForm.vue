<template>
  <div class="barrels-form">
    <v-card class="barrels-form__card">
      <v-card-title class="barrels-form__title">
        <h2>Gestion des fûts</h2>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-for="barrel in barrels" :key="barrel.slug" class="barrel">
          <v-text-field :value="barrel.drink" readonly solo />
          <MoneyField
            :value="barrel.price"
            @change="($event) => adjustBarrelPrice(barrel.slug, $event)"
          />
          <v-btn fab dark small class="delete" @click="removeBarrel(barrel)">
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </div>
      </v-card-text>
      <v-card-text class="barrel-form__add">
        <div class="barrel">
          <v-text-field v-model="drink" solo label="Fût" />
          <MoneyField v-model="price" />
          <v-btn fab dark small color="primary" @click="addNewBarrel">
            <v-icon dark> mdi-plus </v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ConfiguredBarrel } from "@overbookd/personal-account";
import { defineComponent } from "vue";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";

type BarrelsFormData = {
  adjustPriceWithDelay?: ReturnType<typeof setTimeout>;
  drink: string;
  price: number;
};

const TYPING_DELAY = 500;

export default defineComponent({
  name: "BarrelsForm",
  components: { MoneyField },
  emits: ["close-dialog"],
  data: (): BarrelsFormData => ({
    adjustPriceWithDelay: undefined,
    drink: "",
    price: 0,
  }),
  computed: {
    barrels(): ConfiguredBarrel[] {
      return this.$accessor.personalAccount.barrels;
    },
  },
  methods: {
    fetchBarrels() {
      this.$accessor.personalAccount.fetchBarrels();
    },
    async addNewBarrel() {
      await this.$accessor.personalAccount.createBarrel({
        drink: this.drink,
        price: this.price,
      });
      this.fetchBarrels();
      this.drink = "";
      this.price = 0;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    adjustBarrelPrice(slug: string, price: number) {
      clearTimeout(this.adjustPriceWithDelay?.ref());
      this.adjustPriceWithDelay = setTimeout(
        () => this.$accessor.personalAccount.adjustBarrelPrice({ slug, price }),
        TYPING_DELAY,
      );
    },
    async removeBarrel(barrel: ConfiguredBarrel) {
      await this.$accessor.personalAccount.removeBarrel(barrel.slug);
      this.fetchBarrels();
    },
  },
});
</script>

<style lang="scss" scoped>
.barrels-form {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
}

.barrel {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: baseline;
  .delete {
    background-color: $red-24h;
    border-color: $red-24h;
    &:hover {
      background-color: change-color($color: $red-24h, $whiteness: 25%);
      border-color: change-color($color: $red-24h, $whiteness: 25%);
    }
  }
}
</style>
