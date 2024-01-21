<template>
  <v-card>
    <v-card-title>Instructions</v-card-title>

    <v-card-text>
      <SearchSignaLocation
        :location="instructions.appointment"
        label="Lieu"
        :boxed="false"
        @change="updateAppointment($event)"
      />

      <v-label>Description globale</v-label>
      <RichEditor
        :data="instructions.global ?? ''"
        class="mb-6"
        @change="updateGlobal($event)"
      />

      <v-label>Description du/des responsable(s) de la tâche</v-label>
      <RichEditor
        :data="instructions.inCharge.instruction ?? ''"
        class="mb-6"
        @change="updateInChargeInstruction($event)"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import { FestivalTask } from "@overbookd/festival-event";
import { SignaLocation } from "@overbookd/signa";

export default Vue.extend({
  name: "InstructionsCard",
  components: { SearchSignaLocation, RichEditor },
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
  },
});
</script>
