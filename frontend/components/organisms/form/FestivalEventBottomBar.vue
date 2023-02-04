<template>
  <div>
    <div class="bottom-bar">
      <v-btn
        v-if="id > 1"
        class="bottom-bar__navigation"
        small
        fab
        :to="previousLink"
      >
        <v-icon small>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="bottom-bar__actions">
        <v-btn
          v-if="shouldShowRefuseButton"
          color="red"
          class="white--text"
          @click="openRefuseDialog(teamsThatCanRefuse[0])"
          >refusé par {{ teamsThatCanRefuse[0].name }}
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
          >validé par {{ teamsThatNotValidateYet[0].name }}
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
          v-if="isDraft || isRefused"
          color="warning"
          @click="checkBeforeSubmitForReview()"
          >soumettre à validation
        </v-btn>
      </div>
      <v-btn class="bottom-bar__navigation" small fab :to="nextLink">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="isValidationDialogOpen" width="600">
      <FACheckBeforeSubmitCard
        v-if="isFA"
        @close-dialog="isValidationDialogOpen = false"
        @submit="submit"
      ></FACheckBeforeSubmitCard>
      <FTCheckBeforeSubmitCard
        v-else
        @close-dialog="isValidationDialogOpen = false"
        @submit="submit"
      ></FTCheckBeforeSubmitCard>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ConfirmationMessage from "~/components/atoms/ConfirmationMessage.vue";
import {
  getFAValidationStatus,
  isAnimationRefusedBy,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import {
  getFTValidationStatus,
  isTaskRefusedBy,
  isTaskValidatedBy,
} from "~/utils/festivalEvent/ftUtils";
import { FA, Status } from "~/utils/models/FA";
import { FT, FTStatus } from "~/utils/models/ft";
import { Team } from "~/utils/models/team";
import { User } from "~/utils/models/user";
import { hasAtLeastOneError } from "~/utils/rules/faValidationRules";
import { hasAtLeastOneFTError } from "~/utils/rules/ftValidationRules";
import FACheckBeforeSubmitCard from "./fa/FACheckBeforeSubmitCard.vue";
import GearRequestsValidation from "./GearRequestsValidation.vue";
import FTCheckBeforeSubmitCard from "./ft/FTCheckBeforeSubmitCard.vue";

export default Vue.extend({
  name: "FestivalEventBottomBar",
  components: {
    FTCheckBeforeSubmitCard,
    FACheckBeforeSubmitCard,
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
    refuseComment: "",
    gearRequestApprovalDialog: false,
    selectedValidator: {} as Team,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    isFA(): boolean {
      return this.festivalEvent === "FA";
    },
    me(): any {
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
      if (this.me.team.includes("admin")) return this.validators;

      return this.validators.filter((validator: Team) =>
        this.me.team.includes(validator.code)
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
          this.$accessor.FA.allSortedGearRequests
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
        ? this.mFA.status === Status.DRAFT
        : this.mFT.status === FTStatus.DRAFT;
    },
    isSubmitted(): boolean {
      return this.isFA
        ? this.mFA.status === Status.SUBMITTED
        : this.mFT.status === FTStatus.SUBMITTED;
    },
    isRefused(): boolean {
      return this.isFA
        ? this.mFA.status === Status.REFUSED
        : this.mFT.status === FTStatus.REFUSED;
    },
    isValidated(): boolean {
      return this.isFA
        ? this.mFA.status === Status.VALIDATED
        : this.mFT.status === FTStatus.VALIDATED;
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
    previousLink(): string {
      if (this.isFA) return `/fa/${this.mFA.id - 1}`;
      return `/ft/${this.mFT.id - 1}`;
    },
    nextLink(): string {
      if (this.isFA) return `/fa/${this.mFA.id + 1}`;
      return `/ft/${this.mFT.id + 1}`;
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
          this.$accessor.FA.gearRequests.filter(
            (gr) => gr.gear.owner?.code === validator.code
          ).length > 0
        );
      }
      return (
        this.$accessor.FT.gearRequests.filter(
          (gr) => gr.gear.owner?.code === validator.code
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
          validator_id: validator.id,
          user_id: this.me.id,
          team_name: validator.name,
          author,
        };
        return this.$accessor.FA.validate(payload);
      }
      const payload = { author, team: validator };
      return this.$accessor.FT.validate(payload);
    },
    async refuse(validator: Team) {
      if (this.isValidated && !this.isConfirmationDialogOpen) {
        return (this.isConfirmationDialogOpen = true);
      }
      const author = this.meAsUser;
      if (this.isFA) {
        const payload = {
          validator_id: validator.id,
          message: this.refuseComment,
          author,
        };
        await this.$accessor.FA.refuse(payload);
      } else {
        const payload = {
          author,
          team: validator,
          message: this.refuseComment,
        };
        await this.$accessor.FT.refuse(payload);
      }
      this.refuseComment = "";
      this.isRefuseDialogOpen = false;
    },
    checkBeforeSubmitForReview() {
      const hasError = this.isFA
        ? hasAtLeastOneError(this.mFA, this.$accessor.FA.allSortedGearRequests)
        : hasAtLeastOneFTError(this.mFT);
      if (this.isDraft && hasError) return (this.isValidationDialogOpen = true);
      this.submit();
    },
    async submit() {
      this.isValidationDialogOpen = false;
      const author = this.meAsUser;
      if (this.isFA)
        return this.$accessor.FA.submitForReview({
          faId: this.id,
          authorId: author.id,
          author,
        });
      return this.$accessor.FT.submitForReview(author);
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
