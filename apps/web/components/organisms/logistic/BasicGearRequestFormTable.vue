<template>
  <div>
    <div class="gear-request-form">
      <InquiryFormFields
        v-model:gear="gear"
        v-model:quantity="quantity"
        class="gear-request-form__fields"
        @enter="addGearRequest"
      />
      <v-btn
        icon="mdi-plus"
        aria-label="Ajouter le matos"
        title="Ajouter le matos"
        color="primary"
        class="gear-request-form__btn"
        :disabled="cantAddGearRequest"
        rounded="pill"
        @click="addGearRequest"
      />
    </div>

    <v-data-table
      :headers="headers"
      :items="gears"
      :items-per-page="-1"
      :no-data-text="noDataText"
      :mobile="isMobile"
      disable-pagination
      hide-default-footer
    >
      <template #item.remove="{ item }">
        <v-btn
          icon="mdi-trash-can"
          aria-label="Supprimer le matos"
          title="Supprimer le matos"
          size="small"
          variant="flat"
          @click="removeGearRequest(item)"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts" setup>
import type { CatalogGear } from "@overbookd/http";
import type { GearRequest } from "@overbookd/logistic";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const layoutStore = useLayoutStore();

defineProps({
  gears: {
    type: Array as PropType<GearRequest[]>,
    required: true,
  },
  noDataText: {
    type: String,
    default: "Aucun matos",
  },
});

const headers: TableHeaders = [
  { title: "Quantité", value: "quantity", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Supprimer", value: "remove", align: "center" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const emit = defineEmits(["add", "remove"]);

const gear = ref<CatalogGear | undefined>();
const quantity = ref<number>(1);

const cantAddGearRequest = computed<boolean>(
  () => !gear.value || quantity.value <= 0,
);
const addGearRequest = () => {
  if (!gear.value) return;
  const gearRequest = { slug: gear.value.slug, quantity: quantity.value };
  emit("add", gearRequest);

  quantity.value = 1;
  gear.value = undefined;
};
const removeGearRequest = (gear: GearRequest) => {
  emit("remove", gear);
};
</script>

<style lang="scss" scoped>
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
    margin: 10px 0 30px 0;
  }
  @media screen and (max-width: $mobile-max-width) {
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
</style>
