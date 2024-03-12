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
        @add="addVolunteer"
        @remove="removeVolunteer"
      />

      <v-label>Instructions pour le.s responsable.s de la tâche</v-label>
      <RichEditor
        :data="instruction ?? ''"
        class="mb-6"
        @update:data="updateInstruction"
      />
    </v-card-text>

    <v-card-actions class="instructions-card__actions">
      <v-btn :disabled="!canInit" color="primary" large @click="init">
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter des instructions
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Adherent,
  InChargeInstructionsSpecification,
} from "@overbookd/festival-event";
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import SearchUsers from "~/components/atoms/field/search/SearchUsers.vue";

type InitInChargeInstructionsData = {
  volunteers: Adherent[];
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
    canInit(): boolean {
      if (this.instruction === null) return false;
      return InChargeInstructionsSpecification.isSatisfiedBy({
        volunteers: this.volunteers,
        instruction: this.instruction,
      });
    },
  },
  methods: {
    async init() {
      if (this.instruction === null || this.instruction.trim() === "") return;
      const volunteers = this.volunteers.map(({ id }) => id);

      await this.$accessor.festivalTask.initInCharge({
        volunteers,
        instruction: this.instruction,
      });
      this.closeDialog();
    },
    updateInstruction(canBeEmpty: string) {
      const instruction = canBeEmpty.trim() || null;
      this.instruction = instruction;
    },
    addVolunteer(volunteer: Adherent) {
      this.volunteers = [...this.volunteers, volunteer];
    },
    removeVolunteer(volunteer: Adherent) {
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
