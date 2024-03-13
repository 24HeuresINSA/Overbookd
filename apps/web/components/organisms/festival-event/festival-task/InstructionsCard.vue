<template>
  <div>
    <v-card>
      <v-card-title>Instructions</v-card-title>

      <v-card-text>
        <SearchSignaLocation
          :location="instructions.appointment"
          label="Lieu de rendez-vous"
          :boxed="false"
          @change="updateAppointment"
        />

        <v-label>Instructions globale</v-label>
        <RichEditor
          :data="instructions.global ?? ''"
          class="mb-6"
          @update:data="updateGlobal"
        />

        <v-switch
          :value="hasInChargeInstructions"
          label="Ajouter des instructions spécifiques pour le.s responsable.s de la tâche"
          @change="toggleInChargeInstructions"
        />
        <div v-show="hasInChargeInstructions">
          <SearchUsers
            :users="instructions.inCharge.volunteers"
            label="Responsables de la tâche"
            :boxed="false"
            deletable-chips
            @add="addInChargeVolunteer"
            @remove="removeInChargeVolunteer"
          />

          <v-label>Instructions pour le.s responsable.s de la tâche</v-label>
          <RichEditor
            :data="instructions.inCharge.instruction ?? ''"
            class="mb-6"
            @update:data="updateInChargeInstruction"
          />
        </div>

        <v-form class="contact-form">
          <SearchUser
            v-model="contact"
            :list="adherents"
            label="Orga à contacter pour les bénévoles en cas de problème"
            :boxed="false"
            class="contact-form__fields"
            @add="addContact"
            @remove="removeContact"
          />
          <v-btn
            rounded
            color="primary"
            class="contact-form__btn"
            :disabled="!canAddContact"
            @click="addContact"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-form>

        <v-data-table
          :headers="contactHeaders"
          :items="instructions.contacts"
          item-key="key"
          :items-per-page="-1"
          hide-default-footer
        >
          <template #item.volunteer="{ item }">
            {{ formatUserNameWithNickname(item) }}
          </template>

          <template #item.actions="{ item }">
            <v-btn icon @click="removeContact(item)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </template>

          <template #no-data> Aucun contact </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="isInitInChargeDialogOpen" max-width="800">
      <InitInChargeInstructionsCard
        @init="tryToInitInCharge"
        @close-dialog="closeInitInChargeDialog"
      />
    </v-dialog>

    <v-dialog v-model="isResetApprovalsDialogOpen" max-width="600">
      <ResetApprovalsCard
        :label="resetApprovalsLabel"
        @reset="updateAfterApprovalsReset"
        @close-dialog="closeResetApprovalsDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InitInChargeInstructionsCard from "~/components/molecules/festival-event/instructions/InitInChargeInstructionsCard.vue";
import ResetApprovalsCard from "~/components/molecules/festival-event/review/ResetApprovalsCard.vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import SearchUsers from "~/components/atoms/field/search/SearchUsers.vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import {
  FestivalTask,
  FestivalTaskWithConflicts,
  isDraft,
} from "@overbookd/festival-event";
import { SignaLocation } from "@overbookd/signa";
import { User } from "@overbookd/user";
import { Header } from "~/utils/models/data-table.model";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { shouldResetTaskApprovals } from "~/utils/festival-event/festival-task/festival-task.utils";
import { UpdateInstructionsForm, InitInChargeForm } from "@overbookd/http";

type InstructionsCardData = {
  contact: User | null;
  contactHeaders: Header[];
  hasInChargeInstructions: boolean;
  isInitInChargeDialogOpen: boolean;
  isResetApprovalsDialogOpen: boolean;
  formToUpdate: UpdateInstructionsForm | null;
  formToInit: InitInChargeForm | null;
};

export default defineComponent({
  name: "InstructionsCard",
  components: {
    SearchSignaLocation,
    RichEditor,
    SearchUsers,
    SearchUser,
    InitInChargeInstructionsCard,
    ResetApprovalsCard,
  },
  data: (): InstructionsCardData => ({
    contact: null,
    hasInChargeInstructions: false,

    isInitInChargeDialogOpen: false,
    isResetApprovalsDialogOpen: false,
    formToUpdate: null,
    formToInit: null,

    contactHeaders: [
      { text: "Bénévole", value: "volunteer", sortable: false },
      { text: "Téléphone", value: "phone", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  computed: {
    selectedTask(): FestivalTaskWithConflicts {
      return this.$accessor.festivalTask.selectedTask;
    },
    selectedTaskId(): FestivalTask["id"] {
      return this.selectedTask.id;
    },
    instructions(): FestivalTask["instructions"] {
      return this.selectedTask.instructions;
    },
    adherents(): User[] {
      return this.$accessor.user.adherents;
    },
    canAddContact(): boolean {
      return Boolean(this.contact);
    },
    shouldResetApprovals(): boolean {
      return shouldResetTaskApprovals(this.selectedTask);
    },
    resetApprovalsLabel(): string {
      if (this.formToInit) {
        return "Initialiser les instructions des responsables";
      }
      if (this.formToUpdate) {
        return "Modifier les instructions";
      }
      return "Supprimer les instructions des responsables";
    },
  },
  watch: {
    selectedTaskId() {
      this.checkActiveInChargeInstructions();
    },
    isInitInChargeDialogOpen(value: boolean) {
      if (!value) this.checkActiveInChargeInstructions();
    },
  },
  mounted() {
    if (this.adherents.length) return;
    this.$accessor.user.fetchAdherents();
    this.checkActiveInChargeInstructions();
  },
  methods: {
    checkActiveInChargeInstructions() {
      const hasVolunteers = this.instructions.inCharge.volunteers.length > 0;
      const hasInstruction = this.instructions.inCharge.instruction !== null;
      this.hasInChargeInstructions = hasVolunteers || hasInstruction;
    },
    toggleInChargeInstructions() {
      this.hasInChargeInstructions = !this.hasInChargeInstructions;
      if (!this.hasInChargeInstructions) return this.tryToClearInCharge();
      if (!isDraft(this.selectedTask)) this.openInitInChargeDialog();
    },

    updateAppointment(appointment: SignaLocation) {
      const appointmentId = appointment.id;
      this.$accessor.festivalTask.updateInstructions({ appointmentId });
    },

    tryToUpdateGlobal(canBeEmpty: string) {
      if (!this.shouldResetApprovals) return this.updateGlobal(canBeEmpty);

      this.formToUpdate = { global: canBeEmpty.trim() || null };
      this.formToInit = null;
      this.openResetApprovalsDialog();
    },
    updateGlobal(canBeEmpty: string) {
      const global = canBeEmpty.trim() || null;
      this.$accessor.festivalTask.updateInstructions({ global });
    },

    tryToUpdateInChargeInstruction(canBeEmpty: string) {
      if (!this.shouldResetApprovals) return this.updateGlobal(canBeEmpty);

      this.formToUpdate = { inCharge: canBeEmpty.trim() || null };
      this.formToInit = null;
      this.openResetApprovalsDialog();
    },
    updateInChargeInstruction(canBeEmpty: string) {
      const inCharge = canBeEmpty.trim() || null;
      this.$accessor.festivalTask.updateInstructions({ inCharge });
    },

    addContact() {
      if (!this.contact) return;
      this.$accessor.festivalTask.addContact(this.contact.id);
    },
    removeContact(contact: User) {
      this.$accessor.festivalTask.removeContact(contact.id);
    },

    addInChargeVolunteer(volunteer: User) {
      this.$accessor.festivalTask.addInChargeVolunteer(volunteer.id);
    },
    removeInChargeVolunteer(volunteer: User) {
      this.$accessor.festivalTask.removeInChargeVolunteer(volunteer.id);
    },

    async tryToInitInCharge(form: InitInChargeForm) {
      if (!this.shouldResetApprovals) return this.initInCharge(form);

      this.formToInit = form;
      this.formToUpdate = null;
      this.openResetApprovalsDialog();
    },
    async initInCharge(form: InitInChargeForm) {
      await this.$accessor.festivalTask.initInCharge(form);
    },
    openInitInChargeDialog() {
      this.isInitInChargeDialogOpen = true;
    },
    closeInitInChargeDialog() {
      this.checkActiveInChargeInstructions();
      this.isInitInChargeDialogOpen = false;
    },

    async tryToClearInCharge() {
      if (!this.shouldResetApprovals) return this.clearInCharge();

      this.formToUpdate = null;
      this.formToInit = null;
      this.openResetApprovalsDialog();
    },
    async clearInCharge() {
      await this.$accessor.festivalTask.clearInCharge();
    },

    async updateAfterApprovalsReset() {
      if (this.formToInit) {
        await this.initInCharge(this.formToInit);
      } else if (this.formToUpdate) {
        this.$accessor.festivalTask.updateInstructions(this.formToUpdate);
      } else {
        await this.clearInCharge();
      }
      this.closeResetApprovalsDialog();
    },
    openResetApprovalsDialog() {
      this.isResetApprovalsDialogOpen = true;
    },
    closeResetApprovalsDialog() {
      this.isResetApprovalsDialogOpen = false;
      this.isInitInChargeDialogOpen = false;
      this.formToUpdate = null;
      this.formToInit = null;
    },
    formatUserNameWithNickname,
  },
});
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
