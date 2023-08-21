<template>
  <div>
    <div class="bottom-bar">
      <v-btn class="bottom-bar__navigation" small fab @click="previousPage">
        <v-icon small>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="bottom-bar__actions">
        <v-btn
          v-if="shouldShowRefuseButton"
          color="red"
          class="white--text"
          @click="openRefuseDialog(teamsThatCanRefuse[0])"
          >refusé pour {{ teamsThatCanRefuse[0].name }}
        </v-btn>

        <v-menu v-if="shouldShowRefuseMenu" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="white--text" v-bind="attrs" color="red" v-on="on">
              Refuser
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="validator of teamsThatCanRefuse"
              :key="validator.id"
              link
            >
              <v-list-item-title
                @click="openRefuseDialog(validator)"
                v-text="validator.name"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-if="shouldShowValidationButton"
          color="green"
          class="white--text"
          @click="validate(teamsThatNotValidateYet[0])"
          >validé pour {{ teamsThatNotValidateYet[0].name }}
        </v-btn>

        <v-menu v-if="shouldShowValidationMenu" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="white--text" v-bind="attrs" color="green" v-on="on">
              valider
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="validator of teamsThatNotValidateYet"
              :key="validator.id"
              link
            >
              <v-list-item-title
                color="green"
                @click="validate(validator)"
                v-text="validator.name"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-if="shouldShowReadyButton"
          color="purple"
          class="white--text"
          @click="showReadyForAssignment"
          >Prêt pour affectation
        </v-btn>

        <v-btn
          v-if="isDraft || isRefused"
          color="warning"
          :disabled="isRefused && hasAtLeastOneError"
          @click="checkBeforeSubmitForReview()"
          >soumettre à validation
        </v-btn>
        <v-btn v-if="canSave" @click="save">sauvegarder</v-btn>
      </div>
      <v-btn class="bottom-bar__navigation" small fab @click="nextPage">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="isValidationDialogOpen" width="600">
      <FaCheckBeforeSubmitCard
        v-if="isFA"
        @close-dialog="isValidationDialogOpen = false"
        @submit="submit"
      ></FaCheckBeforeSubmitCard>
      <FtCheckBeforeSubmitCard
        v-else
        @close-dialog="isValidationDialogOpen = false"
        @submit="submit"
      ></FtCheckBeforeSubmitCard>
    </v-dialog>

    <v-dialog v-model="gearRequestApprovalDialog" max-width="1000px">
      <GearRequestsValidation
        :festival-event="festivalEvent"
        :validator="selectedValidator"
        @close-dialog="validateGearRequests(selectedValidator)"
      ></GearRequestsValidation>
    </v-dialog>

    <v-dialog v-model="isRefuseDialogOpen" max-width="600px">
      <v-card>
        <v-card-title> Refuser </v-card-title>
        <v-card-text>
          <h3>Pourquoi c'est de la 💩 ?</h3>
          <p>sans trop de 🧂</p>
          <v-textarea v-model="refuseComment" required dense></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="refuse(selectedValidator)">
            enregistrer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isConfirmationDialogOpen" max-width="600px">
      <ConfirmationMessage
        @close-dialog="isConfirmationDialogOpen = false"
        @confirm="refuse(selectedValidator)"
      >
        <template #title> Refuser la {{ festivalEvent }} </template>
        <template #statement>
          Cette {{ festivalEvent }} était pourtant validée par tous les orgas...
          Tu es sûr de vouloir la refuser ?
        </template>
      </ConfirmationMessage>
    </v-dialog>

    <v-dialog v-model="isReadyForAssignmentDialogOpen" max-width="600px">
      <v-card>
        <v-card-title> Prêt à validation </v-card-title>
        <v-card-text>
          <h3>Sélectionne le type et la priorité des créneaux</h3>
        </v-card-text>
        <v-select
          v-model="timeSpanParameters.category"
          class="category-list"
          label="Catégorie"
          :items="categories"
        ></v-select>
        <v-switch
          v-model="timeSpanParameters.hasPriority"
          class="switch-priority"
          label="Créneaux prioritaires"
        ></v-switch>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="switchReadyForAssignment()">
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import {
  getFAValidationStatus,
  isAnimationRefusedBy,
  isAnimationValidatedBy,
} from "~/utils/festival-event/fa.utils";
import {
  getFTValidationStatus,
  isTaskRefusedBy,
  isTaskValidatedBy,
} from "~/utils/festival-event/ft.utils";
import { Fa, FaStatus } from "~/utils/models/fa.model";
import { Ft, FtStatus } from "~/utils/models/ft.model";
import {
  FtTimeSpanParameters,
  TaskCategories,
} from "~/utils/models/ft-time-span.model";
import { Team } from "~/utils/models/team.model";
import { MyUserInformation, User } from "~/utils/models/user.model";
import { hasAtLeastOneError } from "~/utils/rules/fa-validation.rules";
import { hasAtLeastOneFTError } from "~/utils/rules/ft-validation.rules";
import GearRequestsValidation from "../../molecules/logistic/GearRequestsValidation.vue";
import FaCheckBeforeSubmitCard from "./fa/FaCheckBeforeSubmitCard.vue";
import FtCheckBeforeSubmitCard from "./ft/FtCheckBeforeSubmitCard.vue";

export default Vue.extend({
  name: "FestivalEventBottomBar",
  components: {
    FtCheckBeforeSubmitCard,
    FaCheckBeforeSubmitCard,
    ConfirmationMessage,
    GearRequestsValidation,
  },
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    isValidationDialogOpen: false,
    isConfirmationDialogOpen: false,
    isRefuseDialogOpen: false,
    isReadyForAssignmentDialogOpen: false,
    categories: Object.values(TaskCategories),
    timeSpanParameters: {
      hasPriority: false,
      category: TaskCategories.AUCUNE,
    } as FtTimeSpanParameters,
    refuseComment: "",
    gearRequestApprovalDialog: false,
    selectedValidator: {} as Team,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
    isFA(): boolean {
      return this.festivalEvent === "FA";
    },
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    meAsUser(): User {
      return {
        id: this.me.id,
        firstname: this.me.firstname,
        lastname: this.me.lastname,
      };
    },
    id(): number {
      return this.isFA ? this.mFA.id : this.mFT.id;
    },
    validators(): Team[] {
      if (this.isFA) return this.$accessor.team.faValidators;
      return this.$accessor.team.ftValidators;
    },
    mValidators(): Team[] {
      if (!this.validators) return [];
      // admin has all the validators powers
      if (this.me.teams.includes("admin")) return this.validators;

      return this.validators.filter((validator: Team) =>
        this.me.teams.includes(validator.code),
      );
    },
    teamsThatNotValidateYet(): Team[] {
      return this.mValidators.filter((validator: Team) => {
        if (this.isFA) return !this.isAnimationValidatedBy(validator);
        return !this.isTaskValidatedBy(validator);
      });
    },
    teamsThatCanRefuse(): Team[] {
      if (this.isSubmitted) return this.mValidators;

      return this.mValidators.filter((validator: Team) => {
        if (this.isFA) return !this.isAnimationRefusedBy(validator);
        return !this.isTaskRefusedBy(validator);
      });
    },
    hasAtLeastOneError(): boolean {
      if (this.isFA) {
        return hasAtLeastOneError(
          this.mFA,
          this.$accessor.fa.allSortedGearRequests,
        );
      }
      return hasAtLeastOneFTError(this.mFT);
    },
    validationStatus(): string {
      if (this.isFA) return this.mFA.status.toLowerCase();
      return this.mFT.status.toLowerCase();
    },
    isDraft(): boolean {
      return this.isFA
        ? this.mFA.status === FaStatus.DRAFT
        : this.mFT.status === FtStatus.DRAFT;
    },
    isSubmitted(): boolean {
      return this.isFA
        ? this.mFA.status === FaStatus.SUBMITTED
        : this.mFT.status === FtStatus.SUBMITTED;
    },
    isRefused(): boolean {
      return this.isFA
        ? this.mFA.status === FaStatus.REFUSED
        : this.mFT.status === FtStatus.REFUSED;
    },
    isValidated(): boolean {
      return this.isFA
        ? this.mFA.status === FaStatus.VALIDATED
        : this.mFT.status === FtStatus.VALIDATED;
    },
    isSubmittedOrRefused(): boolean {
      return this.isSubmitted || this.isRefused;
    },
    shouldShowValidationButton(): boolean {
      return (
        this.teamsThatNotValidateYet.length === 1 && this.isSubmittedOrRefused
      );
    },
    shouldShowRefuseButton(): boolean {
      return this.teamsThatCanRefuse.length === 1 && !this.isDraft;
    },
    shouldShowValidationMenu(): boolean {
      return (
        this.teamsThatNotValidateYet.length > 1 && this.isSubmittedOrRefused
      );
    },
    shouldShowRefuseMenu(): boolean {
      return this.teamsThatCanRefuse.length > 1 && !this.isDraft;
    },
    shouldShowReadyButton(): boolean {
      return (
        !this.isFA &&
        this.isValidated &&
        this.$accessor.user.can("affect-volunteer")
      );
    },
    previousLink(): string {
      if (this.isFA) return `/fa/${this.mFA.id - 1}`;
      return `/ft/${this.mFT.id - 1}`;
    },
    nextLink(): string {
      if (this.isFA) return `/fa/${this.mFA.id + 1}`;
      return `/ft/${this.mFT.id + 1}`;
    },
    canSave(): boolean {
      return this.isFA && !this.isValidated;
    },
  },
  methods: {
    async validate(validator: Team) {
      if (!validator) return;
      if (!this.shouldValidateGearRequests(validator)) {
        return this.sendValidation(validator);
      }
      this.selectedValidator = validator;
      this.gearRequestApprovalDialog = true;
    },
    shouldValidateGearRequests(validator: Team) {
      if (this.isFA) {
        return (
          this.$accessor.fa.gearRequests.filter(
            (gr) => gr.gear.owner?.code === validator.code,
          ).length > 0
        );
      }
      return (
        this.$accessor.ft.gearRequests.filter(
          (gr) => gr.gear.owner?.code === validator.code,
        ).length > 0
      );
    },
    async validateGearRequests(validator: Team) {
      this.gearRequestApprovalDialog = false;
      this.sendValidation(validator);
    },
    sendValidation(validator: Team) {
      if (!validator) return;
      const author = this.meAsUser;
      if (this.isFA) {
        const payload = {
          validatorId: validator.id,
          userId: this.me.id,
          teamName: validator.name,
          author,
        };
        return this.$accessor.fa.validate(payload);
      }
      const payload = { author, team: validator };
      return this.$accessor.ft.validate(payload);
    },
    async refuse(validator: Team) {
      if (this.isValidated && !this.isConfirmationDialogOpen) {
        return (this.isConfirmationDialogOpen = true);
      }
      const author = this.meAsUser;
      if (this.isFA) {
        const payload = {
          validatorId: validator.id,
          message: this.refuseComment,
          author,
        };
        await this.$accessor.fa.refuse(payload);
      } else {
        const payload = {
          author,
          team: validator,
          message: this.refuseComment,
        };
        await this.$accessor.ft.refuse(payload);
      }
      this.refuseComment = "";
      this.isRefuseDialogOpen = false;
    },
    showReadyForAssignment() {
      if (!this.isReadyForAssignmentDialogOpen)
        this.isReadyForAssignmentDialogOpen = true;
    },
    switchReadyForAssignment() {
      this.isReadyForAssignmentDialogOpen = false;
      if (this.timeSpanParameters.category === TaskCategories.AUCUNE) {
        this.timeSpanParameters.category = undefined;
      }
      this.$accessor.ft.switchToReadyForAssignment({
        author: this.meAsUser,
        timeSpanParameters: this.timeSpanParameters,
      });
    },
    checkBeforeSubmitForReview() {
      const hasError = this.isFA
        ? hasAtLeastOneError(this.mFA, this.$accessor.fa.allSortedGearRequests)
        : hasAtLeastOneFTError(this.mFT);
      if (this.isDraft && hasError) return (this.isValidationDialogOpen = true);
      this.submit();
    },
    async submit() {
      this.isValidationDialogOpen = false;
      const author = this.meAsUser;
      if (this.isFA) return this.$accessor.fa.submitForReview(author);
      return this.$accessor.ft.submitForReview(author);
    },
    validatorValidationStatus(validator: Team) {
      if (this.isFA) {
        return getFAValidationStatus(this.mFA, validator.code).toLowerCase();
      }
      return getFTValidationStatus(this.mFT, validator.code).toLowerCase();
    },
    isAnimationValidatedBy(validator: Team) {
      return isAnimationValidatedBy(this.mFA, validator.code);
    },
    isTaskValidatedBy(validator: Team) {
      return isTaskValidatedBy(this.mFT.reviews, validator.code);
    },
    isAnimationRefusedBy(validator: Team) {
      return isAnimationRefusedBy(this.mFA, validator.code);
    },
    isTaskRefusedBy(validator: Team) {
      return isTaskRefusedBy(this.mFT.reviews, validator.code);
    },
    openRefuseDialog(validator: Team) {
      this.isRefuseDialogOpen = true;
      this.selectedValidator = validator;
    },
    save() {
      this.$accessor.fa.save();
    },
    previousPage() {
      if (this.isFA) return this.$accessor.fa.previousPage();
      return this.$accessor.ft.previousPage();
    },
    nextPage() {
      if (this.isFA) return this.$accessor.fa.nextPage();
      return this.$accessor.ft.nextPage();
    },
  },
});
</script>

<style lang="scss" scoped>
.bottom-bar {
  position: fixed;
  right: 5%;
  bottom: 42px;
  z-index: 3;
  display: flex;
  gap: 30px;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
  }
}

.category-list {
  margin: 0 auto;
  width: 75%;
}
.switch-priority {
  margin: 0 auto;
  width: 75%;
}

@media only screen and (max-width: 965px) {
  .bottom-bar {
    position: fixed;
    bottom: 42px;
    &__actions {
      flex-direction: column;
    }
  }
}
</style>
