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
          <v-btn fab dark small color="primary" @click="removeBarrel(barrel)">
            <v-icon dark> mdi-delete </v-icon>
          </v-btn>
        </div>
      </v-card-text>
      <v-card-actions class="barrel-form__actions">
        <div class="barrel">
          <v-text-field v-model="drink" solo />
          <MoneyField v-model="price" />
        </div>
        <v-btn color="primary" @click="addNewBarrel">Ajouter</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ConfiguredBarrel } from "@overbookd/personal-account";
import { defineComponent } from "vue";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";

type BarrelsFormData = {
  adjustPriceTimeout?: ReturnType<typeof setTimeout>;
  drink: string;
  price: number;
};

export default defineComponent({
  name: "BarrelsForm",
  components: { MoneyField },
  emits: ["close-dialog"],
  data: (): BarrelsFormData => ({
    adjustPriceTimeout: undefined,
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
      clearTimeout(this.adjustPriceTimeout?.ref());
      this.adjustPriceTimeout = setTimeout(
        () => this.$accessor.personalAccount.adjustBarrelPrice({ slug, price }),
        500,
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
  &__actions {
    display: flex;
    justify-content: center;
  }
}
</style>
