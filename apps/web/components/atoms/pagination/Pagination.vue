<template>
  <div class="pagination">
    <div class="pagination__items-per-page">
      <span>Éléments par page :</span>
      <v-combobox
        v-model="itemsPerPageModel"
        class="pagination__items-per-page__combobox"
        :items="itemsPerPageOptions"
        density="compact"
        hide-details
        @update:model-value="onSelectItemsPerPage"
        @keydown.enter="onEnterItemsPerPage"
      />
    </div>
    <div class="pagination__info">
      {{ startIndex + 1 }}-{{ endIndex }} de
      {{ itemsLength }}
    </div>
    <v-pagination
      v-if="!hideNavigation"
      v-model="page"
      :start="0"
      density="comfortable"
      :length="pageCount"
      rounded
      show-first-last-page
      :total-visible="0"
      variant="plain"
    />
  </div>
</template>

<script lang="ts" setup>
import { DEFAULT_ITEMS_PER_PAGE } from "~/utils/vuetify/component-props";

const page = defineModel<number>("page", { default: 0 });
const itemsPerPage = defineModel<number>("itemsPerPage", {
  default: DEFAULT_ITEMS_PER_PAGE,
});

type PaginationOption = { title: string; value: number };

const { itemsPerPageOptions, itemsLength } = defineProps({
  itemsPerPageOptions: {
    type: Array as PropType<PaginationOption[]>,
    default: () => [
      { value: 10, title: "10" },
      { value: 25, title: "25" },
      { value: 50, title: "50" },
      { value: 100, title: "100" },
      { value: -1, title: "Tous" },
    ],
  },
  itemsLength: {
    type: Number,
    default: 0,
  },
  hideNavigation: {
    type: Boolean,
    default: false,
  },
});

const itemsPerPageString = ref<string>("");
const itemsPerPageModel = computed<string>({
  get: () =>
    itemsPerPageOptions.find((item) => item.value === itemsPerPage.value)
      ?.title ?? `${itemsPerPage.value}`,
  set: (value) => (itemsPerPageString.value = value ?? ""),
});

const onSelectItemsPerPage = (
  selectedItem: string | null | PaginationOption,
) => {
  if (typeof selectedItem !== "object" || selectedItem === null) return;
  itemsPerPage.value = selectedItem.value;
};

const onEnterItemsPerPage = () => {
  const numberValue = +itemsPerPageString.value;
  if (isNaN(numberValue) || numberValue < -1 || numberValue === 0) return;
  itemsPerPage.value = numberValue;
};

const displayAllItems = computed<boolean>(() => itemsPerPage.value === -1);

const startIndex = computed<number>(() =>
  displayAllItems.value ? 0 : page.value * itemsPerPage.value,
);
const endIndex = computed<number>(() =>
  displayAllItems.value
    ? itemsLength
    : Math.min(startIndex.value + itemsPerPage.value, itemsLength),
);

const pageCount = computed<number>(() =>
  displayAllItems.value ? 1 : Math.ceil(itemsLength / itemsPerPage.value),
);

watch(
  pageCount,
  (count) => {
    if (page.value >= count) page.value = Math.max(count - 1, 0);
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;

  &__items-per-page {
    display: flex;
    align-items: center;

    span {
      padding-inline-end: 8px;
    }

    &__combobox {
      width: 90px;
    }
  }

  &__info {
    display: flex;
    justify-content: flex-end;
    min-width: 116px;
    padding: 0 16px;
  }
}
</style>
