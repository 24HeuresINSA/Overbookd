<template>
  <v-card class="barrels-form">
    <v-card-title class="barrels-form__title">
      <h2>Gestion des fûts</h2>
      <v-btn icon="mdi-close" variant="flat" @click="close" />
    </v-card-title>
    <v-card-text>
      <div v-for="barrel in barrels" :key="barrel.slug" class="barrel">
        <v-text-field :value="barrel.drink" readonly />
        <MoneyField
          v-model="barrel.price"
          @update:model-value="adjustBarrelPrice(barrel.slug, $event)"
        />
        <v-btn
          icon="mdi-delete"
          size="small"
          color="red"
          class="barrel__action"
          @click="removeBarrel(barrel)"
        />
      </div>
    </v-card-text>
    <v-card-text class="barrel-form__add">
      <div class="barrel">
        <v-text-field v-model="drink" label="Fût" />
        <MoneyField v-model="price" />
        <v-btn
          icon="mdi-plus"
          size="small"
          color="primary"
          class="barrel__action"
          :disabled="cantAddBarrel"
          @click="addNewBarrel"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { ConfiguredBarrel } from "@overbookd/personal-account";

const personalAccountStore = usePersonalAccountStore();

const drink = ref("");
const price = ref(100);

const barrels = computed(() => personalAccountStore.barrels);
const fetchBarrels = () => personalAccountStore.fetchBarrels();

const cantAddBarrel = computed(() => !drink.value || price.value <= 0);
const addNewBarrel = async () => {
  if (cantAddBarrel.value) return;
  await personalAccountStore.createBarrel({
    drink: drink.value,
    price: price.value,
  });
  fetchBarrels();
  drink.value = "";
  price.value = 100;
};
const adjustBarrelPrice = async (slug: string, price: number) => {
  await personalAccountStore.adjustBarrelPrice({ slug, price });
};
const removeBarrel = async (barrel: ConfiguredBarrel) => {
  await personalAccountStore.removeBarrel(barrel.slug);
  fetchBarrels();
};

const emit = defineEmits(["close"]);
const close = () => emit("close");
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
  align-items: center;
  &__action {
    margin-bottom: 10px;
  }
}
</style>
