<template>
  <v-card class="instructions-card">
    <v-btn class="instructions-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="instructions-card__title">
      <h2>Ajouter des instructions spécifiques</h2>
    </v-card-title>
    <v-card-subtitle>
      Ta FT est en attente de relecture. Pour ajouter des instructions
      spécifiques pour le.s responsable.s de la tâche, complète ces champs.
    </v-card-subtitle>

    <v-card-text>
      <SearchUsers
        :users="volunteers"
        label="Responsables de la tâche"
        :boxed="false"
        deletable-chips
        @add="addInChargeVolunteer"
        @remove="removeInChargeVolunteer"
      />

      <v-label>Instructions pour le.s responsable.s de la tâche</v-label>
      <RichEditor
        :data="instruction ?? ''"
        class="mb-6"
        @change="updateInChargeInstruction"
      />
    </v-card-text>

    <v-card-actions class="instructions-card__actions">
      <v-btn
        :disabled="!canInitInChargeInstructions"
        color="primary"
        large
        @click="initInChargeInstructions"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter des instructions
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { User } from "@overbookd/user";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import SearchUsers from "~/components/atoms/field/search/SearchUsers.vue";

type InitInChargeInstructionsData = {
  volunteers: User[];
  instruction: string | null;
};

export default defineComponent({
  name: "InitInChargeInstructionsCard",
  components: { RichEditor, SearchUsers },
  data: (): InitInChargeInstructionsData => ({
    volunteers: [],
    instruction: null,
  }),
  computed: {
    canInitInChargeInstructions(): boolean {
      const hasVolunteers = this.volunteers.length > 0;
      const hasInstruction =
        this.instruction !== null && this.instruction.trim() !== "";
      return hasVolunteers && hasInstruction;
    },
  },
  methods: {
    initInChargeInstructions() {
      // TODO init
      this.closeDialog();
    },
    updateInChargeInstruction(canBeEmpty: string) {
      const instruction = canBeEmpty.trim() || null;
      this.instruction = instruction;
    },
    addInChargeVolunteer(volunteer: User) {
      this.volunteers = [...this.volunteers, volunteer];
    },
    removeInChargeVolunteer(volunteer: User) {
      this.volunteers = this.volunteers.filter((v) => v.id !== volunteer.id);
    },
    clearForm() {
      this.volunteers = [];
      this.instruction = null;
    },
    closeDialog() {
      this.$emit("close-dialog");
      this.clearForm();
    },
  },
});
</script>

<style lang="scss" scoped>
.instructions-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
