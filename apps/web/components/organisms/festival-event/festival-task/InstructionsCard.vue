<template>
  <v-card>
    <v-card-title>Instructions</v-card-title>

    <v-card-text>
      <SearchSignaLocation
        :location="instructions.appointment"
        label="Lieu"
        :boxed="false"
        @change="updateAppointment"
      />

      <v-label>Description globale</v-label>
      <RichEditor
        :data="instructions.global ?? ''"
        class="mb-6"
        @change="updateGlobal"
      />

      <SearchUsers
        :users="instructions.inCharge.volunteers"
        label="Responsables de la tâche"
        :boxed="false"
        deletable-chips
        @add="addInChargeVolunteer"
        @remove="removeInChargeVolunteer"
      />

      <v-label>Description du/des responsable(s) de la tâche</v-label>
      <RichEditor
        :data="instructions.inCharge.instruction ?? ''"
        class="mb-6"
        @change="updateInChargeInstruction"
      />

      <SearchUsers
        :users="instructions.contacts"
        label="Bénévoles à contacter"
        :boxed="false"
        deletable-chips
        @add="addContact"
        @remove="removeContact"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import SearchUsers from "~/components/atoms/field/search/SearchUsers.vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import { FestivalTask } from "@overbookd/festival-event";
import { SignaLocation } from "@overbookd/signa";
import { User } from "@overbookd/user";

export default Vue.extend({
  name: "InstructionsCard",
  components: { SearchSignaLocation, RichEditor, SearchUsers },
  computed: {
    mFT(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    instructions(): FestivalTask["instructions"] {
      return this.mFT.instructions;
    },
  },
  methods: {
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
    addContact(contact: User) {
      this.$accessor.festivalTask.addContact(contact.id);
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
  },
});
</script>
