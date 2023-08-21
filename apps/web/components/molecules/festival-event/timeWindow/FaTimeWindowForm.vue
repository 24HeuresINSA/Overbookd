<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">
          {{ isEditForm ? "Modifier" : "Ajouter" }} un créneau
        </span>
      </v-card-title>

      <v-card-text>
        <div v-if="!isEditForm && timeWindowsType.length > 0">
          <h3>Type de créneau</h3>
          <v-select
            v-model="type"
            type="select"
            :items="timeWindowsType"
            class="type-select"
          ></v-select>
        </div>

        <h3>Début du créneau</h3>
        <DateTimeField v-model="start" label="Début"></DateTimeField>

        <h3>Fin du créneau</h3>
        <DateTimeField v-model="end" label="Fin"></DateTimeField>

        <span> Les activités en journée se passent entre 11h et 18h. </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="checkNeedForConfirmation">
          {{ timeWindow ? "Modifier" : "Ajouter" }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isConfirmationDialogOpen" max-width="600px">
      <ConfirmationMessage
        @close-dialog="closeAllDialogs"
        @confirm="resetLogValidations"
      >
        <template #title>
          {{ timeWindow ? "Modification" : "Ajout" }} du créneau MATOS
        </template>
        <template #statement>
          Confirmer
          {{ timeWindow ? "cette modification" : "cet ajout" }} annulera les
          validations des orgas Matos, Barrieres et Elec 😠
        </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import {
  hasAllValidations,
  hasAtLeastOneValidation,
  isAnimationValidatedBy,
} from "~/utils/festival-event/faUtils";
import { Fa, TimeWindowType } from "~/utils/models/fa";
import { MyUserInformation, User } from "~/utils/models/user";

interface FaTimeWindowFormData {
  start?: Date;
  end?: Date;
  type: TimeWindowType;
  isConfirmationDialogOpen: boolean;
  animOwner: string;
  matosOwners: string[];
}

export default Vue.extend({
  name: "FaTimeWindowForm",
  components: { DateTimeField, ConfirmationMessage },
  model: {
    prop: "timeWindow",
    event: "change",
  },
  props: {
    timeWindow: {
      type: Object,
      default: () => null,
    },
  },
  data: (): FaTimeWindowFormData => ({
    start: undefined,
    end: undefined,
    type: TimeWindowType.ANIM,

    isConfirmationDialogOpen: false,

    animOwner: "humain",
    matosOwners: ["matos", "barrieres", "elec"],
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    timeWindowsType(): string[] {
      const allTimeWindowTypes = Object.values(TimeWindowType);
      if (this.isValidatedByAnimOwner) {
        return allTimeWindowTypes.filter((t) => t !== TimeWindowType.ANIM);
      }
      if (this.isValidatedByMatosOwners) {
        return allTimeWindowTypes.filter((t) => t !== TimeWindowType.MATOS);
      }
      return allTimeWindowTypes;
    },
    startOrManifDate(): Date {
      return this.start ?? this.manifDate;
    },
    endOrManifDate(): Date {
      return this.end ?? this.manifDate;
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    isValidatedByAnimOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.animOwner);
    },
    isValidatedByMatosOwners(): boolean {
      return hasAllValidations(this.mFA, this.matosOwners);
    },
    isEditForm(): boolean {
      return this.timeWindow !== null;
    },
    isFormInvalid(): boolean {
      const requiredFieldsFilled = this.start && this.end;
      if (!requiredFieldsFilled) {
        this.showErrorMessage("❌ Tu dois compléter tous les champs !");
        return true;
      }

      const startBeforeEnd = this.startOrManifDate < this.endOrManifDate;
      if (!startBeforeEnd) {
        this.showErrorMessage(
          "❌ La date de début doit être avant la date de fin !"
        );
        return true;
      }
      return false;
    },
  },
  watch: {
    timeWindow() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      if (!this.timeWindow) return this.clearLocalVariable();

      this.start = this.timeWindow.start;
      this.end = this.timeWindow.end;
      this.type = this.timeWindow.type;
    },
    clearLocalVariable() {
      this.start = this.manifDate;
      this.end = this.manifDate;
      this.type = TimeWindowType.ANIM;
    },
    confirmTimeWindow() {
      if (this.isFormInvalid) return;

      const timeWindow = {
        id: this.timeWindow?.id,
        start: this.startOrManifDate,
        end: this.endOrManifDate,
        type: this.type,
      };

      this.$emit("change", timeWindow);
      this.$emit("close-dialog");
      this.clearLocalVariable();
    },
    checkNeedForConfirmation() {
      const logTeamCodes = ["matos", "barrieres", "elec"];
      const isMatosTimeframe = this.type === TimeWindowType.MATOS;
      const shouldAskConfirmation =
        isMatosTimeframe && hasAtLeastOneValidation(this.mFA, logTeamCodes);

      if (!shouldAskConfirmation) return this.confirmTimeWindow();
      this.isConfirmationDialogOpen = true;
    },
    resetLogValidations() {
      const author: User = {
        id: this.me.id,
        firstname: this.me.firstname,
        lastname: this.me.lastname,
      };
      this.$accessor.fa.resetLogValidations(author);
      this.confirmTimeWindow();
    },
    closeAllDialogs() {
      this.clearLocalVariable();
      this.isConfirmationDialogOpen = false;
      this.$emit("close-dialog");
    },
    showErrorMessage(message: string) {
      return this.$accessor.notif.pushNotification({ message });
    },
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;

  .type-select {
    padding-top: 0;
  }
}
</style>
