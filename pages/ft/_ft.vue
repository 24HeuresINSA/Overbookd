<template>
  <div>
    <v-container
      style="
        display: flex;
        align-content: baseline;
        justify-content: space-between;
      "
    >
      <h1>Fiche Tache 🤩</h1>
      <h2>{{ FT ? FT.status : "draft" }}</h2>
      <v-icon
        v-for="(validator, i) of validators"
        :key="i"
        :color="getIconColor(validator)"
      >
        {{ getValidatorIcon(validator) }}
      </v-icon>
    </v-container>

    <br />
    <FormCard
      title="Général"
      topic="general"
      form-key="ft_general_form"
      :form="FT"
      :is-disabled="isValidated('humain')"
      @form-change="updateForm('general', $event)"
    ></FormCard>

    <br />
    <FormCard
      title="Détail"
      topic="details"
      form-key="ft_details_form"
      :form="FT"
      :is-disabled="isValidated('humain')"
      @form-change="updateForm('details', $event)"
    ></FormCard>

    <br />
    <CompleteTimeframeCard
      :store="store"
      :is-disabled="isValidated('humain')"
    ></CompleteTimeframeCard>

    <br />
    <LogisticsCard
      title="Matos"
      :types="['petit']"
      :store="store"
      :disabled="isValidated('log')"
    ></LogisticsCard>

    <br />
    <CommentCard :comments="FT.comments"></CommentCard>

    <v-dialog v-model="isRefusedDialogOpen" max-width="300">
      <v-card>
        <v-card-title>Refuser la FT</v-card-title>
        <v-card-text>
          <v-textarea v-model="refusedComment"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="refuse">refuse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isSubmitDialogOpen" width="600px">
      <v-card>
        <v-img src="img/memes/submit_FT.gif" height="300px"></v-img>
        <v-card-title>t'es sur de ta FT ?</v-card-title>
        <v-card-actions>
          <v-btn text @click="isSubmitDialogOpen = false">Non</v-btn>
          <v-btn text @click="submitForReview">je suis sûr</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" :timeout="5000"
      >{{ snackbarMessage }}
    </v-snackbar>

    <div style="height: 50px; width: 100%"></div>

    <div
      style="
        display: flex;
        justify-content: space-evenly;
        position: sticky;
        bottom: 20px;
        z-index: 30;
      "
    >
      <v-btn v-if="getValidator()" color="green" @click="validateFT"
        >validé
      </v-btn>
      <v-btn
        v-if="getValidator()"
        color="red"
        @click="isRefusedDialogOpen = true"
        >refusé
      </v-btn>
      <v-btn color="secondary" @click="isSubmitDialogOpen = true"
        >Soumettre a validation</v-btn
      >
      <v-btn color="warning" @click="saveFT">sauvgarder</v-btn>
    </div>
  </div>
</template>

<script>
import { RepoFactory } from "~/repositories/repoFactory";
import FormCard from "../../components/organisms/form/FormCard";
import LogisticsCard from "../../components/organisms/form/LogisticsCard";
import CompleteTimeframeCard from "../../components/organisms/form/CompleteTimeframeCard";
import CommentCard from "../../components/organisms/form/CommentCard";

export default {
  name: "Ft",
  components: { CommentCard, CompleteTimeframeCard, LogisticsCard, FormCard },
  data() {
    return {
      FTID: +this.$route.params.ft, // count
      FT_FORM: this.getConfig("ft_form"),
      FT_VALIDATORS: this.getConfig("ft_validators"),
      FTRepo: RepoFactory.ftRepo,
      store: undefined, // FT store
      schedules: [],
      refusedComment: undefined,
      isRefusedDialogOpen: false,
      isSubmitDialogOpen: false,
      isSnackbarOpen: false,
      isAssignmentDialogOpen: false,
      selectedTimeframeIndex: undefined,
      assignedRole: undefined,
      assignedAmount: undefined,
      assignedHuman: undefined,
      usernames: [],
      requiredHumans: [],
      snackbarMessage: "",
      feedbacks: {
        validate: "FT valide ",
        refused: "FT refuse  🥺",
        save: "FT sauvgarde",
        submitted: "FT soumise a validation 🥵 may the odds be with you",
      },
      schedule: {
        date: undefined,
        start: undefined,
        end: undefined,
      },

      isEquipmentDialogOpen: false,
      equipmentsHeader: [
        { text: "item", value: "name" },
        { text: "selectionné", value: "selectedAmount" },
      ],

      selectedEquipment: [],
      availableEquipment: [],
      validators: undefined,
      color: {
        submitted: "grey",
        validated: "green",
        refused: "red",
      },
    };
  },

  computed: {
    FT: function () {
      return this.$accessor.FT.mFT;
    },
    me: function () {
      return this.$accessor.user.me;
    },
  },

  async mounted() {
    this.validators = this.$accessor.config.getConfig("ft_validators");

    // get FT and store it in store
    this.store = this.$accessor.FT;
    await this.store.getAndSetFT(this.FTID);
  },

  methods: {
    getIconColor(validator) {
      if (this.FT.validated) {
        if (this.FT.validated.find((v) => v === validator)) {
          return this.color.validated;
        }
      }
      if (this.FT.refused) {
        if (this.FT.refused.find((v) => v === validator)) {
          return this.color.refused;
        }
      }
      if (this.FT.status === "submitted") {
        return this.color.submitted;
      }
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    isValidated(validator) {
      return this.FT.validated.find((v) => v === validator) !== undefined;
    },

    hasRole(role) {
      return this.me.team.includes(role);
    },

    getValidator() {
      let mValidator = null;
      this.FT_VALIDATORS.forEach((validator) => {
        if (this.hasRole(validator)) {
          mValidator = validator;
        }
      });
      return mValidator;
    },

    async saveFT() {
      await this.store.saveFT();
    },

    updateForm(section, form) {
      let newForm = {};
      newForm[section] = form;
      this.store.assignFT(newForm);
    },

    getValidatorIcon(validator) {
      try {
        return this.getConfig("teams").find((team) => team.name === validator)
          .icon;
      } catch (e) {
        console.log(`can't find icon of team ${validator}`);
      }
    },

    validateFT() {
      const validator = this.getValidator();

      this.store.validate(validator);

      this.snackbarMessage = this.feedbacks.validate;
      this.isSnackbarOpen = true;
    },

    submitForReview() {
      this.store.submitForReview();
      this.snackbarMessage = this.feedbacks.submitted;
      this.isSnackbarOpen = true;
      this.isSubmitDialogOpen = false;
    },

    refuse() {
      const validator = this.getValidator();

      this.store.refuse({
        validator,
        comment: this.refusedComment,
      });
      this.isRefusedDialogOpen = false;
    },
  },
};
</script>

<style scoped></style>
