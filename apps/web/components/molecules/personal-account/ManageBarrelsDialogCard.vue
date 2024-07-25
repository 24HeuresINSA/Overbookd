<template>
  <DialogCard without-actions @close="close">
    <template #title>Gestion des fûts</template>
    <template #content>
      <div v-for="barrel in barrels" :key="barrel.slug" class="barrel">
        <v-text-field :model-value="barrel.drink" label="Fût" readonly />
        <DateField
          v-model="barrel.openedOn"
          label="Date d'ouverture"
          @update:model-value="adjustBarrelOpeningDate(barrel.slug, $event)"
        />
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
      <div class="actions">
        <h2>Ajouter un fût</h2>
        <div class="barrel">
          <v-text-field v-model="drink" label="Fût" />
          <DateField v-model="openedOn" label="Date d'ouverture" />
          <MoneyField v-model="price" />
          <v-btn
            icon="mdi-plus"
            size="small"
            color="primary"
            variant="elevated"
            class="barrel__action"
            :disabled="cantAddBarrel"
            @click="addNewBarrel"
          />
        </div>
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { ConfiguredBarrel } from "@overbookd/personal-account";

const personalAccountStore = usePersonalAccountStore();

const drink = ref<string>("");
const price = ref<number>(100);
const openedOn = ref<Date>(new Date());

const barrels = computed<ConfiguredBarrel[]>(
  () => personalAccountStore.barrels,
);
const fetchBarrels = () => personalAccountStore.fetchBarrels();

const cantAddBarrel = computed<boolean>(() => !drink.value || price.value <= 0);
const addNewBarrel = async () => {
  if (cantAddBarrel.value) return;
  await personalAccountStore.createBarrel({
    drink: drink.value,
    price: price.value,
    openedOn: openedOn.value,
  });
  fetchBarrels();
  drink.value = "";
  price.value = 100;
  openedOn.value = new Date();
};
const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const adjustBarrelPrice = (slug: string, price: number) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(
    () => personalAccountStore.adjustBarrelPrice({ slug, price }),
    800,
  );
};
const adjustBarrelOpeningDate = (slug: string, openedOn: Date) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(
    () => personalAccountStore.adjustBarrelOpeningDate({ slug, openedOn }),
    800,
  );
};
const removeBarrel = async (barrel: ConfiguredBarrel) => {
  await personalAccountStore.removeBarrel(barrel.slug);
  fetchBarrels();
};

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.barrel {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  &__action {
    margin-bottom: 10px;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 5px;
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
  }
}
</style>
