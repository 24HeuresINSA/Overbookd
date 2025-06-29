<template>
  <div class="contractors__listing">
    <v-data-table
      :headers="tableHeaders"
      :items="contractors"
      :items-per-page="-1"
      no-data-text="Aucun prestataire"
      :mobile="isMobile"
      disable-pagination
      hide-default-footer
    >
      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-pencil"
          aria-label="Éditer le presta"
          title="Éditer le presta"
          size="small"
          variant="flat"
          @click="openUpdateContractorDialog(item)"
        />
        <v-btn
          icon="mdi-trash-can"
          aria-label="Supprimer le presta"
          title="Supprimer le presta"
          size="small"
          variant="flat"
          @click="removeContractor(item)"
        />
      </template>
    </v-data-table>

    <v-btn
      color="primary"
      class="contractors__add"
      text="Ajouter un presta"
      @click="openAddContractorDialog"
    />

    <v-dialog v-model="isContractorDialogOpen" max-width="600">
      <ContractorForm
        :contractor="selectedContractor"
        @add="addContractor"
        @update="updateContractor"
        @close="closeDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {
  Contractor,
  PrepareContractorCreation,
} from "@overbookd/festival-event";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const layoutStore = useLayoutStore();

const emit = defineEmits(["add", "update", "remove"]);

const props = defineProps({
  contractors: {
    type: Array as PropType<Contractor[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Prénom", value: "firstname", sortable: true },
    { title: "Nom", value: "lastname", sortable: true },
    { title: "Téléphone", value: "phone" },
    { title: "Email", value: "email", sortable: true },
    { title: "Société", value: "company", sortable: true },
    { title: "Commentaire", value: "comment" },
  ];
  const actionsHeader = { title: "Actions", value: "actions" };
  return props.disabled ? baseHeaders : [...baseHeaders, actionsHeader];
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const selectedContractor = ref<Contractor | null>(null);

const isContractorDialogOpen = ref<boolean>(false);
const openAddContractorDialog = () => {
  selectedContractor.value = null;
  isContractorDialogOpen.value = true;
};
const openUpdateContractorDialog = (contractor: Contractor) => {
  selectedContractor.value = contractor;
  isContractorDialogOpen.value = true;
};
const closeDialog = () => {
  isContractorDialogOpen.value = false;
  selectedContractor.value = null;
};

const addContractor = (contractor: PrepareContractorCreation) => {
  emit("add", contractor);
};
const updateContractor = (contractor: Contractor) => {
  emit("update", contractor);
};
const removeContractor = (contractor: Contractor) => {
  emit("remove", contractor);
};
</script>

<style lang="scss" scoped>
.contractors {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}
</style>
