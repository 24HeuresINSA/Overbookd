<template>
  <div>
    <div
      style="display: flex; justify-content: space-between; align-items: center"
    >
      <h1>Fiche Activitée 🤯</h1>
      <h2 v-if="isNewFA">Create new FA</h2>
      <h2 v-if="FA.count">FA: {{ FA.count }}</h2>
      <h3>{{ FA.status ? FA.status : "draft" }}</h3>
      <v-icon
        v-for="(validator, i) of validators"
        :key="i"
        :color="getIconColor(validator)"
      >
        {{ getValidatorIcon(validator) }}
      </v-icon>
    </div>
    <br />
    <v-container style="display: grid; width: 100%">
      <v-row>
        <v-col md="6">
          <FormCard
            style="height: 100%; width: 100%"
            title="Général"
            form-key="fa_general_form"
            topic="general"
            :is-disabled="isValidated('humain')"
            :form="FA"
            @form-change="updateForm('general', $event)"
          ></FormCard>
        </v-col>
        <v-col md="6">
          <FormCard
            title="Presta"
            form-key="fa_external_form"
            topic="general"
            :is-disabled="isValidated('humain')"
            :form="FA"
            @form-change="updateForm('general', $event)"
          ></FormCard>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <FormCard
            title="Détail"
            form-key="fa_details_form"
            topic="details"
            :is-disabled="isValidated('humain')"
            :form="FA"
            @form-change="updateForm('details', $event)"
          ></FormCard>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <TimeframeTable
            :init-timeframes="FA.timeframes"
            :disabled="!isValidated('human')"
            :is-disabled="isValidated('humain')"
            :form="FA"
            :store="FAStore"
          ></TimeframeTable>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <FormCard
            title="Sécu"
            topic="security"
            form-key="fa_security_form"
            :is-disabled="isValidated('secu')"
            :form="FA"
            @form-change="updateForm('security', $event)"
          ></FormCard>
        </v-col>
        <v-col md="6">
          <FormCard
            title="Signa"
            topic="signalisation"
            form-key="fa_signalisation_form"
            :is-disabled="isValidated('signa')"
            :form="FA"
            @form-change="updateForm('signalisation', $event)"
          ></FormCard>
        </v-col>
      </v-row>
      <v-col>
        <h2>Logistique 🚚</h2>
        <LogisticsCard
          title="Matos"
          :types="['gros']"
          :store="FAStore"
          :disabled="isValidated('log')"
        ></LogisticsCard>
      </v-col>
      <v-row />
      <br />
      <LogisticsCard
        title="Barrieres"
        :types="['barrieres']"
        :store="FAStore"
        :disabled="isValidated('barrieres')"
      ></LogisticsCard>
      <br />
      <LogisticsCard
        title="Elec"
        :types="['elec']"
        :store="FAStore"
        :disabled="isValidated('elec')"
      ></LogisticsCard>

      <br />
      <CommentCard :comments="FA.comments"></CommentCard>

      <br />
      <FTCard></FTCard>
    </v-container>

    <div style="height: 100px"></div>

    <div
      style="
        display: flex;
        justify-content: space-evenly;
        position: sticky;
        bottom: 20px;
        z-index: 30;
      "
    >
      <v-btn v-if="validator" color="red" @click="refuseDialog = true"
        >refusé</v-btn
      >
      <v-btn v-if="validator" color="green" @click="validate">validé</v-btn>
      <v-btn color="secondary" @click="validationDialog = true"
        >soumettre à validation
      </v-btn>
      <v-btn color="warning" @click="saveFA">sauvgarder</v-btn>
    </div>

    <v-dialog v-model="validationDialog" width="500">
      <v-card>
        <v-img
          height="620"
          src="https://media.discordapp.net/attachments/726537148119122023/806793684598128640/WhatsApp_Image_2021-02-03_at_23.36.35.jpeg"
        ></v-img>

        <v-card-title> ⚠️ Warning ⚠️ </v-card-title>

        <v-card-text> T'es sur de ta merde la ? </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="submitForReview">
            soumettre
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="refuseDialog" max-width="600px">
      <v-card>
        <v-card-title> Refuser </v-card-title>
        <v-card-text>
          <h4>pourquoi c'est de la 💩</h4>
          <p>sans trop de 🧂</p>
          <v-textarea v-model="refuseComment" required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="refuse"> enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="isSnackbar" :timeout="5000">
      {{ snackbarMessage }}

      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="isSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import FormCard from "../../components/organisms/form/FormCard";
import TimeframeTable from "../../components/organisms/timeframeTable";
import { RepoFactory } from "../../repositories/repoFactory";
import LogisticsCard from "../../components/organisms/form/LogisticsCard";
import CommentCard from "../../components/organisms/form/CommentCard";
import FTCard from "../../components/organisms/form/FTCard";

export default {
  name: "Fa",
  components: { FTCard, CommentCard, LogisticsCard, TimeframeTable, FormCard },
  middleware: "user",

  data() {
    return {
      FAID: this.$route.params.fa,
      isNewFA: this.$route.params.fa === "newFA",

      FTname: undefined,

      FARepo: RepoFactory.faRepo,
      FAStore: undefined,

      validationDialog: false,
      refuseDialog: false,

      refuseComment: "",
      isSnackbar: false,
      snackbarMessage: "la FA a bien ete sauvgarder 😅",
      schedule: {
        date: undefined,
        start: undefined,
        end: undefined,
      },
      color: {
        submitted: "grey",
        validated: "green",
        refused: "red",
      },

      FTHeader: [
        { text: "nom", value: "name" },
        { text: "action", value: "action" },
      ],

      validators: undefined,
      teams: undefined,
    };
  },

  computed: {
    FA: function () {
      return this.$accessor.FA.mFA;
    },
    me: function () {
      return this.$accessor.user.me;
    },
    validator: function () {
      let mValidator = null;
      if (this.validators) {
        this.validators.forEach((validator) => {
          if (this.me.team && this.me.team.includes(validator)) {
            mValidator = validator;
          }
        });
        return mValidator;
      }
      return null;
    },
  },

  async mounted() {
    this.validators = this.$accessor.config.getConfig("fa_validators");
    this.FAStore = this.$accessor.FA;
    this.teams = this.$accessor.config.getConfig("teams");

    // get FA if not new FA
    if (!this.isNewFA) {
      let FA = (await this.FARepo.getFAByCount(this, this.FAID)).data;
      this.FAStore.setFA(FA);
    } else {
      this.FAStore.resetFA();
    }
  },

  methods: {
    getValidatorIcon(validator) {
      try {
        return this.teams.find((team) => team.name === validator).icon;
      } catch (e) {
        console.log(`can't find icon of team ${validator}`);
      }
    },

    isValidated(validator) {
      return this.FA.validated.find((v) => v === validator) !== undefined;
    },

    hasRole(role) {
      if (this.me.role) {
        return this.me.team.includes(role);
      }
      return false;
    },

    getIconColor(validator) {
      if (this.FA.validated) {
        if (this.FA.validated.find((v) => v === validator)) {
          return this.color.validated;
        }
      }
      if (this.FA.refused) {
        if (this.FA.refused.find((v) => v === validator)) {
          return this.color.refused;
        }
      }
      if (this.FA.status === "submitted") {
        return this.color.submitted;
      }
    },

    async saveFA() {
      // save the FA in the DB
      // this.FA.equipments = this.selectedEquipments;
      if (this.isNewFA) {
        await this.FARepo.createNewFA(this, this.FA);
      } else {
        await this.FARepo.updateFA(this, this.FA);
      }
      this.isSnackbar = true;
    },

    submitForReview() {
      // change status to submitted for review and save in DB
      this.FAStore.setStatus({
        status: "submitted",
        by: this.me.lastname,
      });
      this.validationDialog = false;
      this.saveFA();
    },

    validate() {
      const validator = this.validator();
      if (validator) {
        this.FAStore.validate(validator);
        this.saveFA();
      }
    },

    refuse() {
      // refuse FA
      const validator = this.validator;
      this.FAStore.refuse({
        validator,
        comment: this.refuseComment,
      });
      this.refuseDialog = false;
      this.saveFA();
    },

    updateForm(section, form) {
      let newForm = {};
      newForm[section] = form;
      this.FAStore.assignFA(newForm);
    },
  },
};
</script>

<style scoped></style>
