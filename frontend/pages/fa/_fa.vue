<template>
  <div class="main fa">
    <div class="sidebar">
      <h1>Fiche Activité n°{{ faId }}</h1>
      <h2>{{ faName }}</h2>

      <div class="status">
        <span class="dot" :class="faValidationStatus"></span>
        <h3>
          {{
            mFA.status ? statusTrad.get(mFA.status.toUpperCase()) : "Brouillon"
          }}
        </h3>
      </div>

      <div class="icons">
        <div v-for="validator of validators" :key="validator.code" class="icon">
          <v-icon :class="validatorValidationStatus(validator)" size="26">
            {{ validator.icon }}
          </v-icon>
          <span class="icon-detail">{{ validator.name }}</span>
        </div>
      </div>
      <FestivalEventSummary class="summary" />
    </div>
    <v-container class="container fa">
      <FAGeneralCard id="general" />
      <FADetailCard id="detail" />
      <SignaCard id="signa" />
      <TimeframeTable id="timewindow" />
      <SecurityCard id="security" />
      <CollaboratorCard id="presta" />
      <h2 id="log" class="log-text">Logistique 🚚</h2>
      <h4 class="log-text">
        S'il manque des informations, ou du matos veuillez contacter le
        responsable de la logistique sur
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>.
      </h4>
      <LogisticTimeWindow />
      <LogisticsCardFA
        title="Matos"
        owner="matos"
        :ponctual-usage-gear="false"
      />
      <LogisticsCardFA
        title="Barrières"
        owner="barrieres"
        :ponctual-usage-gear="false"
      />
      <LogisticsCardFA
        title="Matos Elec / Eau"
        owner="elec"
        :ponctual-usage-gear="false"
      />
      <ElecLogisticCard id="elec" />
      <WaterLogisticCard id="water" />
      <CommentCard id="comment" />
      <ChildFTCard id="ft" />
    </v-container>
    <SnackNotificationContainer />

    <div class="bottom-bar">
      <v-btn
        v-if="mFA.id > 1"
        class="bottom-bar__navigation"
        small
        fab
        :to="`/fa/${mFA.id - 1}`"
      >
        <v-icon small>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="bottom-bar__actions">
        <v-btn
          v-if="shouldShowRefuseButton"
          color="red"
          class="white--text"
          @click="openRefuseDialog(mValidators[0])"
          >refusé par {{ mValidators[0].name }}
        </v-btn>
        <v-menu v-if="shouldShowRefuseMenu" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="white--text" v-bind="attrs" color="red" v-on="on">
              Refuser
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="validator of mValidators"
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
          @click="validate(teamsThatNotYetValidatedFA[0])"
          >validé par {{ teamsThatNotYetValidatedFA[0].name }}
        </v-btn>
        <v-menu v-if="shouldShowValidationMenu" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="white--text" v-bind="attrs" color="green" v-on="on">
              valider
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="validator of teamsThatNotYetValidatedFA"
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
          v-if="isDraftOrRefused"
          color="warning"
          :disabled="mFA.status === 'SUBMITTED' && hasAtLeastOneError"
          @click="checkBeforeAskForValidation()"
          >soumettre à validation
        </v-btn>
        <v-btn v-if="mFA.status !== 'VALIDATED'" @click="saveFA"
          >sauvegarder</v-btn
        >
        <v-btn v-if="isRecoverable" color="red" @click="undelete"
          >récupérer
        </v-btn>
      </div>
      <v-btn class="bottom-bar__navigation" small fab :to="`/fa/${mFA.id + 1}`">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="isValidationDialogOpen" width="600">
      <FACheckBeforeSubmitCard
        @close-dialog="isValidationDialogOpen = false"
        @submit="submit"
      ></FACheckBeforeSubmitCard>
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

    <v-dialog v-model="gearRequestApprovalDialog" max-width="1000px">
      <GearRequestsValidation
        :validator="validatorTeam"
        @close-dialog="validateGearRequests(validatorTeam)"
      ></GearRequestsValidation>
    </v-dialog>

    <v-dialog v-model="isConfirmationDialogOpen" max-width="600px">
      <ConfirmationMessage
        @close-dialog="isConfirmationDialogOpen = false"
        @confirm="refuse(mValidators[0])"
      >
        <template #title> Refuser la FA </template>
        <template #statement>
          Cette FA était pourtant validée par tous les orgas... Tu es sûr de
          vouloir la refuser ?
        </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ConfirmationMessage from "~/components/atoms/ConfirmationMessage.vue";
import LogisticTimeWindow from "~/components/molecules/logistics/LogisticTimeWindow.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import FACheckBeforeSubmitCard from "~/components/organisms/form/fa/FACheckBeforeSubmitCard.vue";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import ChildFTCard from "~/components/organisms/form/fa/ChildFTCard.vue";
import CollaboratorCard from "~/components/organisms/form/fa/CollaboratorCard.vue";
import ElecLogisticCard from "~/components/organisms/form/fa/ElecLogisticCard.vue";
import FADetailCard from "~/components/organisms/form/fa/FADetailCard.vue";
import FAGeneralCard from "~/components/organisms/form/fa/FAGeneralCard.vue";
import GearRequestsValidation from "~/components/organisms/form/fa/GearRequestsValidation.vue";
import SecurityCard from "~/components/organisms/form/fa/SecurityCard.vue";
import SignaCard from "~/components/organisms/form/fa/SignaCard.vue";
import TimeframeTable from "~/components/organisms/form/fa/TimeframeTable.vue";
import WaterLogisticCard from "~/components/organisms/form/fa/WaterLogisticCard.vue";
import FestivalEventSummary from "~/components/organisms/form/FestivalEventSummary.vue";
import LogisticsCardFA from "~/components/organisms/form/LogisticsCardFA.vue";
import { RepoFactory } from "~/repositories/repoFactory";
import {
  getFAValidationStatus,
  isAnimationRefusedBy,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import { Status } from "~/utils/models/FA";
import { Team } from "~/utils/models/team";
import { hasAtLeastOneError } from "~/utils/rules/faValidationRules";

export default Vue.extend({
  name: "Fa",
  components: {
    ElecLogisticCard,
    CommentCard,
    SignaCard,
    LogisticsCardFA,
    TimeframeTable,
    CollaboratorCard,
    WaterLogisticCard,
    FAGeneralCard,
    FADetailCard,
    SecurityCard,
    FestivalEventSummary,
    SnackNotificationContainer,
    LogisticTimeWindow,
    FACheckBeforeSubmitCard,
    GearRequestsValidation,
    ConfirmationMessage,
    ChildFTCard,
  },

  data: () => ({
    isValidationDialogOpen: false,
    isConfirmationDialogOpen: false,
    isRefuseDialogOpen: false,

    selectedValidator: undefined as Team | undefined,

    refuseComment: "",
    gearRequestApprovalDialog: false,
    validatorTeam: { name: "", code: "", id: 0, color: "", icon: "" } as Team,

    faRepo: RepoFactory.faRepo,

    statusTrad: new Map<string, string>([
      ["DRAFT", "Brouillon"],
      ["SUBMITTED", "Soumise à validation"],
      ["REFUSED", "Refusée"],
      ["VALIDATED", "Validée"],
    ]),
    color: {
      submitted: "grey",
      validated: "green",
      refused: "red",
    },
  }),

  computed: {
    FA(): any {
      return this.$accessor.FA;
    },
    mFA(): any {
      return this.$accessor.FA.mFA;
    },
    me(): any {
      return this.$accessor.user.me;
    },
    faId(): number {
      return +this.$route.params.fa;
    },
    faName(): string {
      return this.$accessor.FA.mFA.name;
    },
    validators(): Team[] {
      return this.$accessor.team.faValidators;
    },
    mValidators(): Team[] {
      let mValidator: Team[] = [];
      if (this.me.team.includes("admin")) {
        // admin has all the validators powers
        return this.validators;
      }
      if (this.validators) {
        this.validators.forEach((validator: Team) => {
          if (this.me.team && this.me.team.includes(validator.name)) {
            mValidator.push(validator);
          }
        });
        return mValidator;
      }
      return [];
    },
    teamsThatNotYetValidatedFA(): Team[] {
      return this.mValidators.filter((validator: Team) => {
        return !this.isAnimationValidatedBy(validator);
      });
    },
    hasAtLeastOneError(): boolean {
      return hasAtLeastOneError(this.mFA, this.FA.allSortedGearRequests);
    },
    faValidationStatus(): string {
      return this.mFA.status.toLowerCase();
    },
    isRecoverable(): boolean {
      return this.mValidators.length >= 1 && this.mFA.isValid === false;
    },
    isDraftOrRefused(): boolean {
      return (
        this.mFA.status === Status.DRAFT || this.mFA.status === Status.REFUSED
      );
    },
    isSubmittedOrRefused(): boolean {
      return (
        this.mFA.status === Status.SUBMITTED ||
        this.mFA.status === Status.REFUSED
      );
    },
    isNotDraft(): boolean {
      return this.mFA.status !== Status.DRAFT;
    },
    shouldShowValidationButton(): boolean {
      return (
        this.teamsThatNotYetValidatedFA.length === 1 &&
        this.isSubmittedOrRefused
      );
    },
    shouldShowRefuseButton(): boolean {
      return this.mValidators.length === 1 && this.isNotDraft;
    },
    shouldShowValidationMenu(): boolean {
      return (
        this.teamsThatNotYetValidatedFA.length > 1 && this.isSubmittedOrRefused
      );
    },
    shouldShowRefuseMenu(): boolean {
      return this.mValidators.length > 1 && this.isNotDraft;
    },
  },

  async mounted() {
    await this.$accessor.FA.getAndSet(this.faId);
    if (this.mFA.id !== this.faId) {
      alert("Oups 😬 J'ai l'impression que cette FA n'existe pas...");
      await this.$router.push({
        path: "/fa",
      });
    }

    let title = "FA " + this.faId;
    if (this.mFA.name) title += " - " + this.mFA.name;
    document.title = title;

    this.$accessor.signa.getAllSignaLocations();

    this.selectedValidator = this.mValidators[0];
    if (this.validators.length === 0) {
      await this.$accessor.team.fetchFaValidators();
    }
  },
  methods: {
    async saveFA() {
      await this.$accessor.FA.save();
      await this.$store.dispatch("notif/pushNotification", {
        type: "success",
        message: "✅ FA sauvegardée !",
      });
    },

    async undelete() {
      await this.mFA.undelete();
    },

    async validate(validator: Team) {
      if (!validator) return;

      if (!this.shoudlValidateGearRequests(validator)) {
        return this.sendValidation(validator);
      }

      this.validatorTeam = validator;
      this.gearRequestApprovalDialog = true;
    },

    shoudlValidateGearRequests(validator: Team) {
      return (
        this.$accessor.FA.gearRequests.filter(
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
      const payload = {
        validator_id: validator.id,
        user_id: this.$accessor.user.me.id,
        team_name: validator.name,
        author: this.me,
      };
      return this.$accessor.FA.validate(payload);
    },

    async refuse(validator?: Team) {
      if (!validator) return;
      if (
        this.mFA.status === Status.VALIDATED &&
        !this.isConfirmationDialogOpen
      ) {
        return (this.isConfirmationDialogOpen = true);
      }

      const payload = {
        validator_id: validator.id,
        message: this.refuseComment,
        author: this.me,
      };
      await this.$accessor.FA.refuse(payload);
      this.refuseComment = "";
      this.isRefuseDialogOpen = false;
    },

    checkBeforeAskForValidation() {
      if (this.mFA.status === "DRAFT")
        return (this.isValidationDialogOpen = true);
      this.submit();
    },

    submit() {
      this.$accessor.FA.submitForReview({
        faId: this.faId,
        authorId: this.me.id,
        author: this.me,
      });
      this.isValidationDialogOpen = false;
      this.saveFA();
    },

    validatorValidationStatus(validator: Team) {
      return getFAValidationStatus(this.mFA, validator.code).toLowerCase();
    },

    isAnimationValidatedBy(validator: Team) {
      return isAnimationValidatedBy(this.mFA, validator.code);
    },

    isAnimationRefusedBy(validator: Team) {
      return isAnimationRefusedBy(this.mFA, validator.code);
    },

    openRefuseDialog(validator: Team) {
      this.isRefuseDialogOpen = true;
      this.selectedValidator = validator;
    },
  },
});
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  height: calc(100vh - 124px);
  overflow-y: hidden;
}

.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  overflow: auto;
  padding-right: 20px;
  width: 300px;

  h1 {
    font-size: 1.7rem;
    margin: 16px;
    margin-bottom: 4px;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: normal;
    color: rgb(89, 89, 89);
    margin: 16px;
    margin-top: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: auto;
    display: block;
    overflow: hidden;
  }

  .status {
    display: flex;
    align-items: center;

    .dot {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 16px;
      margin-right: 10px;
    }
  }
}

.icons {
  display: flex;
  justify-content: space-between;
  margin: 20px 5px 15px 16px;

  .icon {
    position: relative;
    display: inline-block;

    .icon-detail {
      visibility: hidden;
      width: 60px;
      font-size: 0.9rem;
      text-align: center;
      border-radius: 6px;
      user-select: none;

      position: absolute;
      z-index: 1;
      top: 100%;
      left: 50%;
      margin-left: -30px;
    }
  }

  .icon:hover .icon-detail {
    visibility: visible;
  }
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
  scroll-behavior: smooth;
  padding-bottom: 50px;
  > * {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
}

.log-text {
  margin-bottom: 8px;
}

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
  .container {
    padding-bottom: 200px;
  }
}

@media only screen and (max-width: 750px) {
  .main {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .summary {
    visibility: collapse;
  }

  .container {
    overflow: visible;
  }
}
</style>
