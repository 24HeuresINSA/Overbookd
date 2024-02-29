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

        <v-label>Description globale</v-label>
        <RichEditor
          :data="instructions.global ?? ''"
          class="mb-6"
          @change="updateGlobal"
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
            @change="updateInChargeInstruction"
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
      <InitInChargeInstructionsCard @close-dialog="closeInitInChargeDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import SearchUsers from "~/components/atoms/field/search/SearchUsers.vue";
import SearchUser from "~/components/atoms/field/search/SearchUser.vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import { FestivalTask, isDraft } from "@overbookd/festival-event";
import { SignaLocation } from "@overbookd/signa";
import { User } from "@overbookd/user";
import { Header } from "~/utils/models/data-table.model";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import InitInChargeInstructionsCard from "~/components/molecules/festival-event/instructions/InitInChargeInstructionsCard.vue";

type InstructionsCardData = {
  contact: User | null;
  contactHeaders: Header[];
  hasInChargeInstructions: boolean;
  isInitInChargeDialogOpen: boolean;
};

export default defineComponent({
  name: "InstructionsCard",
  components: {
    SearchSignaLocation,
    RichEditor,
    SearchUsers,
    SearchUser,
    InitInChargeInstructionsCard,
  },
  data: (): InstructionsCardData => ({
    contact: null,
    hasInChargeInstructions: false,
    isInitInChargeDialogOpen: false,
    contactHeaders: [
      { text: "Bénévole", value: "volunteer", sortable: false },
      { text: "Téléphone", value: "phone", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  computed: {
    selectedTask(): FestivalTask {
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
  },
  watch: {
    selectedTaskId() {
      this.checkActiveInChargeInstructions();
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
      if (!this.hasInChargeInstructions) return this.clearInCharge();
      if (!isDraft(this.selectedTask)) this.openInitInChargeDialog();
    },
    updateAppointment(appointment: SignaLocation) {
      const appointmentId = appointment.id;
      this.$accessor.festivalTask.updateInstructions({ appointmentId });
    },
    updateGlobal(canBeEmpty: string) {
      const global = canBeEmpty.trim() || null;
      this.$accessor.festivalTask.updateInstructions({ global });
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
    clearInCharge() {
      this.$accessor.festivalTask.clearInCharge();
    },
    openInitInChargeDialog() {
      this.isInitInChargeDialogOpen = true;
    },
    closeInitInChargeDialog() {
      this.checkActiveInChargeInstructions();
      this.isInitInChargeDialogOpen = false;
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
