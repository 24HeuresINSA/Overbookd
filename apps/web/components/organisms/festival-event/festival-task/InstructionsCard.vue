<template>
  <div>
    <v-card>
      <v-card-title>Instructions</v-card-title>
      <v-card-text>
        <SearchLocation
          :model-value="instructions.appointment"
          label="Lieu de rendez-vous"
          :disabled="disabled"
          @update:model-value="updateAppointment($event?.id)"
        />

        <v-label>Instructions globales</v-label>
        <InstructionsEditor
          :model-value="globalInstruction"
          scope="global-instruction"
          :readonly="disabled && !canForceInstruction"
          :can-save="canSaveInstructions"
          :can-force-instruction="canForceInstruction"
          @save="saveGlobal"
          @force-save="forceSaveGlobal"
        />

        <v-switch
          :model-value="hasInChargeInstructions"
          :disabled="disabled"
          label="Ajouter des instructions spécifiques pour le.s responsable.s de la tâche"
          color="primary"
          hide-details
          @update:model-value="toggleConfirmationDialogCard"
        />
        <div v-show="hasInChargeInstructions">
          <SearchUsers
            v-model="instructions.inCharge.volunteers"
            label="Responsables de la tâche"
            :disabled="disabled"
            closable-chips
            @add="addInChargeVolunteer"
            @remove="removeInChargeVolunteer"
          />

          <v-label>Instructions pour le.s responsable.s de la tâche</v-label>
          <InstructionsEditor
            :model-value="inChargeInstruction"
            scope="in-charge-instruction"
            :readonly="disabled && !canForceInstruction"
            :can-save="canSaveInstructions"
            :can-force-instruction="canForceInstruction"
            @save="saveInCharge"
            @force-save="forceSaveInCharge"
          />
        </div>

        <v-form class="contact-form">
          <SearchUser
            :model-value="contact"
            :list="potentialContacts"
            label="Orga à contacter pour les bénévoles en cas de problème"
            :disabled="disabled"
            class="contact-form__fields"
            hide-details
            @update:model-value="addContact($event?.id)"
          />
        </v-form>

        <v-data-table
          :headers="contactHeaders"
          :items="instructions.contacts"
          :items-per-page="-1"
          no-data-text="Aucun contact"
          :mobile="isMobile"
          hide-default-footer
          hide-details
        >
          <template #item.volunteer="{ item }">
            {{ buildUserNameWithNickname(item) }}
          </template>

          <template #item.removal="{ item }">
            <v-btn
              icon="mdi-trash-can"
              size="small"
              variant="flat"
              :disabled="disabled"
              @click="removeContact(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="isInitInChargeDialogOpen"
      max-width="800"
      @after-leave="checkActiveInChargeInstructions"
    >
      <InitInChargeInstructionsCard
        @init="initInCharge"
        @close="closeInitInChargeDialog"
      />
    </v-dialog>

    <v-dialog v-model="isConfirmationDialogOpen" max-width="650">
      <ConfirmationDialogCard
        width="600"
        justify-self="center"
        @close="closeConfirmationDialog"
        @confirm="toggleInChargeInstructions"
      >
        <template #statement>
          <p>
            Vous êtes sur le point de supprimer les instructions pour le
            responsable de tâche !
          </p>
          <br />
          <p>Souhaitez-vous continuer ?</p>
        </template>
      </ConfirmationDialogCard>
    </v-dialog>

    <v-dialog
      v-model="isResetApprovalsDialogOpen"
      max-width="600"
      @after-leave="checkActiveInChargeInstructions"
    >
      <ResetApprovalsDialogCard
        @confirm="approveResetAlert"
        @close="declineResetApprovalsDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  type Contact,
  type FestivalTaskWithConflicts,
  isDraft,
} from "@overbookd/festival-event";
import type { SignaLocation } from "@overbookd/signa";
import { type User, buildUserNameWithNickname } from "@overbookd/user";
import type { InitInChargeForm, UpdateInstructionsForm } from "@overbookd/http";
import { FORCE_WRITE_FT } from "@overbookd/permission";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import {
  hasTaskApprovals,
  shouldResetTaskApprovals,
} from "~/utils/festival-event/festival-task/festival-task.utils";
import ConfirmationDialogCard from "~/components/atoms/card/ConfirmationDialogCard.vue";

const ftStore = useFestivalTaskStore();
const userStore = useUserStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const contactHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Bénévole", value: "volunteer" },
    { title: "Téléphone", value: "phone" },
  ];
  const removalHeader = { title: "Suppression", value: "removal" };
  return props.disabled ? baseHeaders : [...baseHeaders, removalHeader];
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const selectedTask = computed<FestivalTaskWithConflicts>(
  () => ftStore.selectedTask,
);
const instructions = computed<FestivalTaskWithConflicts["instructions"]>(
  () => selectedTask.value.instructions,
);

const contact = ref<Contact | undefined>();

userStore.fetchAdherents();
const adherents = computed<User[]>(() => userStore.adherents);
const potentialContacts = computed<User[]>(() => {
  return adherents.value.filter((adherent) => {
    return !instructions.value.contacts.some(
      (contact) => contact.id === adherent.id,
    );
  });
});

const isConfirmationDialogOpen = ref<boolean>(false);
const openConfirmationDialog = () => (isConfirmationDialogOpen.value = true);
const closeConfirmationDialog = () => (isConfirmationDialogOpen.value = false);

const shouldResetApprovals = computed<boolean>(() =>
  shouldResetTaskApprovals(selectedTask.value),
);
const hasApprovals = computed<boolean>(() =>
  hasTaskApprovals(selectedTask.value),
);
const canForceInstruction = computed<boolean>(() => {
  const hasPermission = userStore.can(FORCE_WRITE_FT);
  return (props.disabled || hasApprovals.value) && hasPermission;
});
const canSaveInstructions = computed<boolean>(
  () => !props.disabled && (shouldResetApprovals.value || !hasApprovals.value),
);

const isInitInChargeDialogOpen = ref<boolean>(false);
const openInitInChargeDialog = () => (isInitInChargeDialogOpen.value = true);
const closeInitInChargeDialog = () => (isInitInChargeDialogOpen.value = false);

const hasInChargeInstructions = ref<boolean>(false);

const isResetApprovalsDialogOpen = ref<boolean>(false);
const ADD_IN_CHARGE = "add-in-charge";
const REMOVE_IN_CHARGE = "remove-in-charge";
const MODIFY_INSTRUCTIONS = "modify-instructions";
type ResetApprovalAction =
  | {
      type: typeof ADD_IN_CHARGE;
      form: InitInChargeForm;
    }
  | {
      type: typeof REMOVE_IN_CHARGE;
    }
  | {
      type: typeof MODIFY_INSTRUCTIONS;
      instructions: UpdateInstructionsForm;
    };
const resetApprovalAction = ref<ResetApprovalAction>();

const declineResetApprovalsDialog = () =>
  (isResetApprovalsDialogOpen.value = false);
const approveResetAlert = async () => {
  const action = resetApprovalAction.value;
  if (!action) return;
  switch (action.type) {
    case ADD_IN_CHARGE:
      await ftStore.initInCharge(action.form);
      hasInChargeInstructions.value = true;
      break;
    case REMOVE_IN_CHARGE:
      await ftStore.clearInCharge();
      break;
    case MODIFY_INSTRUCTIONS:
      await ftStore.updateInstructions(action.instructions);
      break;
  }
  isResetApprovalsDialogOpen.value = false;
};

const toggleConfirmationDialogCard = () => {
  if (hasInChargeInstructions.value) {
    openConfirmationDialog();
    return;
  }
  toggleInChargeInstructions();
};

const toggleInChargeInstructions = async () => {
  hasInChargeInstructions.value = !hasInChargeInstructions.value;
  isConfirmationDialogOpen.value = false;
  if (hasInChargeInstructions.value) {
    if (!isDraft(selectedTask.value)) openInitInChargeDialog();
    return;
  }

  if (shouldResetApprovals.value) {
    resetApprovalAction.value = { type: REMOVE_IN_CHARGE };
    isResetApprovalsDialogOpen.value = true;
    return;
  }

  await ftStore.clearInCharge();
};
const checkActiveInChargeInstructions = () => {
  const hasVolunteers = instructions.value.inCharge.volunteers.length > 0;
  const hasInstruction = instructions.value.inCharge.instruction !== null;
  hasInChargeInstructions.value = hasVolunteers || hasInstruction;
};

const globalInstruction = computed<string>(
  () => instructions.value.global ?? "",
);
const saveGlobal = (global: string) => {
  if (shouldResetApprovals.value) {
    resetApprovalAction.value = {
      type: MODIFY_INSTRUCTIONS,
      instructions: { global },
    };
    isResetApprovalsDialogOpen.value = true;
    return;
  }

  ftStore.updateInstructions({ global });
};
const forceSaveGlobal = (global: string) => {
  if (!canForceInstruction.value) return;
  ftStore.forceInstructions({ global });
};

const inChargeInstruction = computed<string>(
  () => instructions.value.inCharge.instruction ?? "",
);
const saveInCharge = (inCharge: string) => {
  if (shouldResetApprovals.value) {
    resetApprovalAction.value = {
      type: MODIFY_INSTRUCTIONS,
      instructions: { inCharge },
    };
    isResetApprovalsDialogOpen.value = true;
    return;
  }

  ftStore.updateInstructions({ inCharge });
};
const forceSaveInCharge = (inCharge: string) => {
  if (!canForceInstruction.value) return;
  ftStore.forceInstructions({ inCharge });
};

const selectedTaskId = computed<number>(() => selectedTask.value.id);
watch(
  selectedTaskId,
  () => {
    checkActiveInChargeInstructions();
  },
  { immediate: true },
);

const updateAppointment = (appointmentId?: SignaLocation["id"]) => {
  ftStore.updateInstructions({ appointmentId });
};

const addContact = (contactId?: Contact["id"]) => {
  if (!contactId) return;
  ftStore.addContact(contactId);
  contact.value = undefined;
};
const removeContact = (contact: User) => {
  ftStore.removeContact(contact.id);
};

const addInChargeVolunteer = async (volunteer: User) => {
  await ftStore.addInChargeVolunteer(volunteer.id);
};
const removeInChargeVolunteer = async (volunteer: User) => {
  await ftStore.removeInChargeVolunteer(volunteer.id);
};

const initInCharge = async (form: InitInChargeForm) => {
  if (shouldResetApprovals.value) {
    resetApprovalAction.value = { type: ADD_IN_CHARGE, form };
    isResetApprovalsDialogOpen.value = true;
    closeInitInChargeDialog();
    return;
  }

  await ftStore.initInCharge(form);
  closeInitInChargeDialog();
  hasInChargeInstructions.value = true;
};
</script>

<style lang="scss" scoped>
.contact-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-top: 20px;
  margin-bottom: 0;
  gap: 1em;
  &__fields {
    width: 100%;
  }
}
</style>
