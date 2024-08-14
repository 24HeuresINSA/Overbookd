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
        <RichEditor
          :model-value="instructions.global ?? ''"
          :readonly="disabled && cantForceInstruction"
          class="mb-3"
          @update:model-value="updateGlobal"
        />

        <v-switch
          :model-value="hasInChargeInstructions"
          :disabled="disabled"
          label="Ajouter des instructions spécifiques pour le.s responsable.s de la tâche"
          color="primary"
          hide-details
          @update:model-value="toggleInChargeInstructions"
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
          <RichEditor
            :model-value="instructions.inCharge.instruction ?? ''"
            :readonly="disabled && cantForceInstruction"
            class="mb-3"
            @update:model-value="updateInChargeInstruction"
          />
        </div>

        <v-form class="contact-form">
          <SearchUser
            :model-value="contact"
            :list="potentialContacts"
            label="Orga à contacter pour les bénévoles en cas de problème"
            :disabled="disabled"
            class="contact-form__fields"
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

    <v-dialog v-model="isInitInChargeDialogOpen" max-width="800">
      <InitInChargeInstructionsCard
        @init="initInCharge"
        @close="closeInitInChargeDialog"
      />
    </v-dialog>

    <v-dialog v-model="isResetApprovalsDialogOpen" max-width="600">
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
import type { InitInChargeForm } from "@overbookd/http";
import { FORCE_WRITE_FT } from "@overbookd/permission";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { shouldResetTaskApprovals } from "~/utils/festival-event/festival-task/festival-task.utils";

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
const isMobile = computed<boolean>(() => !layoutStore.isDesktop);

const selectedTask = computed<FestivalTaskWithConflicts>(
  () => ftStore.selectedTask,
);
const selectedTaskId = computed<number>(() => selectedTask.value.id);
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

const shouldResetApprovals = computed<boolean>(() =>
  shouldResetTaskApprovals(selectedTask.value),
);
const cantForceInstruction = computed<boolean>(() => {
  const hasPermission = userStore.can(FORCE_WRITE_FT);
  return !props.disabled || !hasPermission;
});

const isInitInChargeDialogOpen = ref<boolean>(false);
const openInitInChargeDialog = () => (isInitInChargeDialogOpen.value = true);
const closeInitInChargeDialog = () => (isInitInChargeDialogOpen.value = false);

const removeFocus = () => {
  if (!(document.activeElement instanceof HTMLElement)) return;
  document.activeElement.blur();
};

const isResetApprovalsDialogOpen = ref<boolean>(false);
const hasApproveResetAlert = ref<boolean>(false);
const hasInChargeInstructions = ref<boolean>(false);
const openResetApprovalsDialogIfNeeded = () => {
  if (!shouldResetApprovals.value || hasApproveResetAlert.value) return;
  removeFocus();
  isResetApprovalsDialogOpen.value = true;
};
const declineResetApprovalsDialog = () =>
  (isResetApprovalsDialogOpen.value = false);
const approveResetAlert = () => {
  hasApproveResetAlert.value = true;
  isResetApprovalsDialogOpen.value = false;
};

const toggleInChargeInstructions = async () => {
  hasInChargeInstructions.value = !hasInChargeInstructions.value;
  if (!hasInChargeInstructions.value) {
    openResetApprovalsDialogIfNeeded();
    if (isResetApprovalsDialogOpen.value) return;
    await ftStore.clearInCharge();
    return;
  }
  if (!isDraft(selectedTask.value)) openInitInChargeDialog();
};
const checkActiveInChargeInstructions = () => {
  const hasVolunteers = instructions.value.inCharge.volunteers.length > 0;
  const hasInstruction = instructions.value.inCharge.instruction !== null;
  hasInChargeInstructions.value = hasVolunteers || hasInstruction;
};
watch(
  selectedTaskId,
  () => {
    checkActiveInChargeInstructions();
    hasApproveResetAlert.value = false;
  },
  { immediate: true },
);
watch(isInitInChargeDialogOpen, (value: boolean) => {
  if (!value) checkActiveInChargeInstructions();
});
watch(isResetApprovalsDialogOpen, (value: boolean) => {
  if (!value) checkActiveInChargeInstructions();
});

const updateAppointment = (appointmentId?: SignaLocation["id"]) => {
  ftStore.updateInstructions({ appointmentId });
};
const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const updateGlobal = (canBeEmpty: string) => {
  openResetApprovalsDialogIfNeeded();
  if (delay.value) clearInterval(delay.value);
  const global = canBeEmpty.trim() || null;
  delay.value = setTimeout(() => {
    if (cantForceInstruction.value) {
      return ftStore.updateInstructions({ global });
    }
    if (global === null) return;
    ftStore.forceInstructions({ global });
  }, 800);
};
const updateInChargeInstruction = (canBeEmpty: string) => {
  openResetApprovalsDialogIfNeeded();
  if (delay.value) clearInterval(delay.value);
  const inCharge = canBeEmpty.trim() || null;
  delay.value = setTimeout(() => {
    if (cantForceInstruction.value) {
      return ftStore.updateInstructions({ inCharge });
    }
    if (inCharge === null) return;
    ftStore.forceInstructions({ inCharge });
  }, 800);
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
  margin-top: 10px;
  margin-bottom: 0;
  gap: 1em;
  &__fields {
    width: 100%;
  }
}
</style>
