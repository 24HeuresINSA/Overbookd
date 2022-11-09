<template>
  <div>
    <div class="main">
      <h1>Fiche Activité</h1>
      <h2 v-if="isNewFA">Create new FA</h2>
      <h2
        v-if="FA.count"
        :style="FA.isValid === false ? `text-decoration:line-through;` : ``">
        {{ FA.isValid === false ? "[SUPPRIME] " : "" }}FA: {{ FA.count }}
      </h2>
      <h3>{{ FA.status ? FA.status : "draft" }}</h3>
      <v-icon
        v-for="(validator, i) of VALIDATORS"
        :key="i"
        :color="getIconColor(validator)"
      >
        {{ getValidatorIcon(validator) }}
      </v-icon>
    </div>
    <br />
    <v-container class="container">
      <v-row>
        <v-col md="6">
        <v-card :class="isValidated('humain') ? 'isvalidated' : ''">
        <v-card-title>Général</v-card-title>
        <v-card-subtitle>N'hésite pas si tu as des questions à contacter humain@24heures.org. Tu peux aussi t'aider en allant voir les FA d'avant sur cetaitmieuxavant.24heures.org/ en te connectant avec jeuneetcon@24heures.org </v-card-subtitle>
        <v-card-text class="whitespace">
          <v-form>
            <v-text-field
              v-model="formData.name"
              label="Nom de la FA"
              required
            ></v-text-field>
            <v-select
              v-model="formData.type"
              type="select"
              label="type"
              :items="['Concert',
              'Course',
              'Divertissement',
              'Initiation',
              'Match de Gala',
              'Tournoi',
              'Vente',
              'Prévention',
              'Spectacle',
              'Autre']"
              dense
              required
            ></v-select>
            <v-text-field
              v-model="formData.team"
              label="Equipe"
              type="teams"
              required
            ></v-text-field>
            <v-text-field
              v-model="formData.inCharge"
              label="Responsable"
              type="user"
              required
            ></v-text-field>
          </v-form>
          </v-card-text>
          </v-card>
            <!-- <v-btn color="primary" @click="submitForm">Envoyer</v-btn>
          </v-form>
          <FormCard
            style="height: 100%; width: 100%"
            title="Général"
            details="N'hésite pas si tu as des questions à contacter humain@24heures.org. Tu peux aussi t'aider en allant voir les FA d'avant sur cetaitmieuxavant.24heures.org/ en te connectant avec jeuneetcon@24heures.org "
            form-key="fa_general_form"
            topic="general"
            :is-disabled="isValidated('humain')"
            :form="FA"
            @form-change="updateForm('general', $event)"
          ></FormCard> -->
        </v-col>
        <v-col md="6">
          <OverSigna :is-disabled="isValidated('signa')"></OverSigna>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="formData.description"
            label="Description"
            type="rich-text">
          </v-text-field>
          <v-switch
            v-model="formData.isPublishable"
            label="Publier sur le site / plaquette"
            :disabled="disabled"
            @change="onChange"
          ></v-switch>
          <v-switch
            v-model="formData.isMajorAnim"
            label="Anim phare"
            :disabled="disabled"
            @change="onChange"
          ></v-switch>
          <v-switch
            v-model="formData.isForKids"
            label="Anim pour les gosses"
            :disabled="disabled"
            @change="onChange"
          ></v-switch>
          

          <!-- <FormCard
            title="Détail"
            form-key="fa_details_form"
            details="Décris ici ton activité, soit assez exhaustif, si tu le demandes, c'est ce texte qui sera publié sur le site 24heures.org"
            topic="details"
            :is-disabled="isValidated('humain')"
            :form="FA"
            @form-change="updateForm('details', $event)"
          ></FormCard> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <TimeframeTable
            :init-timeframes="FA.timeframes"
            :disabled="!isValidated('human')"
            :is-disabled="isValidated('humain')"
            :form="FA"
            :store="store"
          ></TimeframeTable>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <PassSecuCard></PassSecuCard>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <v-card :class="isValidated('secu') ? 'isvalidated' : ''">
            <v-card-title>Sécurité</v-card-title>
            <v-card-subtitle>Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu de ton activité, contacte securite@24heures.org</v-card-subtitle>
            <v-card-text>
              <v-form>
                <v-textarea
                  v-model="formData.securityDevice"
                  label="Dispositif de sécurité particulier"
                  required
                ></v-textarea>
                </v-form>
                </v-card-text>
            </v-card>
          <!-- <FormCard
            title="Sécurité"
            form-key="fa_security_form"
            topic="security"
            details="Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu de ton activité, contacte securite@24heures.org"
            :is-disabled="isValidated('secu')"
            :form="FA"
            @form-change="updateForm('security', $event)"
          ></FormCard> -->
        </v-col>
        <v-col md="6">
          <v-card :class="isValidated('humain') ? 'isvalidated' : ''">
            <v-card-title>Presta</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="formData.fullname"
                  label="Nom complet de l'intervenant">
                </v-text-field>
                <v-text-field
                  v-model="formData.company"
                  label="Société">
                </v-text-field>
                <v-text-field
                  v-model="formData.phone"
                  label="Téléphone">
                </v-text-field>
                <v-text-field
                  v-model="formData.email"
                  label="E-mail">
                </v-text-field>
                <v-text-field
                  v-model="formData.comment"
                  label="Commentaire">
                </v-text-field>
                <v-switch
                  v-model="formData.needsHosting"
                  label="Besoin d'hébergement">
                </v-switch>
                <v-text-field
                  v-model="formData.requiredSandwichFriday"
                  label="Nombre de sandwichs vendredi">
                </v-text-field>
                <v-text-field
                  v-model="formData.requiredSandwichSaturday"
                  label="Nombre de sandwichs samedi">
                </v-text-field>
                <v-text-field
                  v-model="formData.requiredSandwichSunday"
                  label="Nombre de sandwichs dimanche">
                </v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
          <!-- <FormCard
            title="Presta"
            form-key="fa_external_form"
            topic="external"
            :is-disabled="isValidated('humain')"
            :form="FA"
            @form-change="updateForm('external', $event)"
          ></FormCard> -->
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h2>Logistique 🚚</h2>
          <h4>
            S'il manque des informations, ou du matos veuillez contacter le
            responsable de la logistique sur
            <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>
          </h4>
          <LogisticsCard
            title="Matos"
            :types="Object.values(EquipmentTypes)"
            :store="store"
            :disabled="isValidated('log')"
          ></LogisticsCard>
        </v-col>
      </v-row>
      <v-row />
      <br />
      <LogisticsCard
        title="Barrières"
        :types="Object.values(BarrieresTypes)"
        :store="store"
        :disabled="isValidated('barrieres')"
      ></LogisticsCard>
      <br />
      <LogisticsCard
        title="Matos Elec / Eau"
        :types="Object.values(ElecTypes)"
        :store="store"
        :disabled="isValidated('elec')"
      ></LogisticsCard>
      <br />

      <v-row>
        <v-col md="6">
          <ElecLogisticCard
            :is-disabled="isValidated('elec')"
          ></ElecLogisticCard>
        </v-col>
        <v-col md="6">
          <v-card :class="isValidated('elec') ? 'isvalidated' : ''">
            <v-card-title>Eau</v-card-title>
            <v-card-subtitle>Si ton animation a besoin d'eau, il faut savoir quel est le débit dont tu as besoin et comment on l'évacue. pour plus de renseignement voit avec la Log Elec via logistique@24heures.org</v-card-subtitle>
            <v-card-text>
              <v-form>
                <v-switch
                  v-model="formData.isWaterNeeded"
                  label="Besoin d'eau">
                </v-switch>
                <v-text-field
                  v-model="formData.waterNeed"
                  label="Desctiption du besoin en eau">
                </v-text-field>
                </v-form>
                </v-card-text>
            </v-card>
          <!-- <FormCard
            title="Eau"
            form-key="fa_water_form"
            topic="elec"
            details="Si ton animation a besoin d'eau, il faut savoir quel est le débit dont tu as besoin et comment on l'évacue. pour plus de renseignement voit avec la Log Elec via logistique@24heures.org"
            :is-disabled="isValidated('elec')"
            :form="FA"
            @form-change="updateForm('elec', $event)"
          ></FormCard> -->
        </v-col>
      </v-row>

      <br />
      <CommentCard :comments="FA.comments" form="FA"></CommentCard>

      <br />
      <FTCard v-if="isFTOpen"></FTCard>
    </v-container>

    <div class="whitespace"></div>

    <div class="actionbtn">
      <div>
        <v-btn v-if="FA.count > 1" small fab :href="`/fa/${FA.count - 1}`">
          <v-icon small>mdi-arrow-left</v-icon>
        </v-btn>

        <v-btn
          v-if="validators.length === 1"
          color="red"
          @click="
            v = validators[0];
            refuseDialog = true;
          "
          >refusé par {{ validators[0] }}
        </v-btn>
        <v-menu v-if="validators.length > 1" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn
              class="white--text ma-5"
              v-bind="attrs"
              color="red"
              v-on="on"
            >
              Refuser
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="validator of validators" :key="validator" link>
              <v-list-item-title
                @click="
                  v = validator;
                  refuseDialog = true;
                "
                v-text="validator"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div>
        <template v-if="validators.length === 1">
          <v-btn color="green" @click="validate(validators[0])"
            >validé par {{ validators[0] }}
          </v-btn>
        </template>
        <v-menu v-if="validators.length > 1" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn
              class="white--text ma-5"
              v-bind="attrs"
              color="green"
              v-on="on"
            >
              valider
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="validator of validators" :key="validator" link>
              <v-list-item-title
                color="green"
                @click="validate(validator)"
                v-text="validator"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-btn
        v-if="FA.status !== 'submitted'"
        color="warning"
        @click="validationDialog = true"
        >soumettre à validation
      </v-btn>
      <v-btn @click="saveFA">sauvegarder</v-btn>
      <v-btn
        v-if="validators.length >= 1 && FA.isValid === false"
        color="red"
        @click="undelete"
        >récupérer
      </v-btn>
      <v-btn small fab :href="`/fa/${FA.count + 1}`">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-btn>
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
import FTCard from "../../components/organisms/form/fa/FTCard";
import { safeCall } from "../../utils/api/calls";
import PassSecuCard from "../../components/organisms/form/fa/PassSecuCard";
import OverSigna from "../../components/organisms/form/fa/OverSigna";
import ElecLogisticCard from "../../components/organisms/form/fa/ElecLogisticCard";
import {
  EquipmentTypes,
  ElecTypes,
  BarrieresTypes,
} from "../../utils/models/FA";

export default {
  name: "Fa",
  components: {
    ElecLogisticCard,
    OverSigna,
    PassSecuCard,
    FTCard,
    CommentCard,
    LogisticsCard,
    TimeframeTable,
    FormCard,
  },
  middleware: "user",

  data() {
    return {
      // Imports of enums for equipment types
      EquipmentTypes,
      ElecTypes,
      BarrieresTypes,

      FAID: this.$route.params.fa,
      isNewFA: this.$route.params.fa === "newFA",

      FTname: undefined,

      FARepo: RepoFactory.faRepo,
      FAStore: undefined,

      validationDialog: false,
      refuseDialog: false,

      isFTOpen: true,

      refuseComment: "",
      isSnackbar: false,
      snackbarMessage: "la FA à bien été sauvegardée 😅",
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

      teams: undefined,
      v: undefined,
      VALIDATORS: [],
    };
  },

  computed: {
    store: function () {
      return this.$accessor.FA;
    },
    FA: function () {
      return this.$accessor.FA.mFA;
    },
    me: function () {
      return this.$accessor.user.me;
    },
    validators: function () {
      let mValidator = [];
      const validators = this.$accessor.config.getConfig("fa_validators");
      if (this.me.team.includes("admin")) {
        // admin has all the validators powers
        return validators;
      }
      if (validators) {
        validators.forEach((validator) => {
          if (this.me.team && this.me.team.includes(validator)) {
            mValidator.push(validator);
          }
        });
        return mValidator;
      }
      return [];
    },
  },

  async mounted() {
    this.FAStore = this.$accessor.FA;
    this.teams = this.$accessor.config.getConfig("teams");
    this.VALIDATORS = this.$accessor.config.getConfig("fa_validators");
    this.isFTOpen = this.$accessor.config.getConfig("is_ft_open");

    // get FA if not new FA
    if (!this.isNewFA) {
      let FA = (await this.FARepo.getFAByCount(this, this.FAID)).data;
      this.FAStore.setFA(FA);
    } else {
      this.FAStore.resetFA();
    }
    document.title = "FA:" + this.FAID;
  },

  methods: {
    async undelete() {
      await this.FAStore.undelete();
      await safeCall(
        this,
        this.FARepo.updateFA(this, this.FAStore.mFA),
        "undelete"
      );
    },
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
      return this.$accessor.user.hasRole(role);
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

    validate(validator) {
      if (validator) {
        this.FAStore.validate(validator);
        this.saveFA();
      }
    },

    refuse() {
      const validator = this.v;
      // refuse FA
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

<style scoped>
.main{
  display: flex; 
  justify-content: space-between; 
  align-items: center;
}

.container{
  display: grid; 
  width: 100%;
}

.whitespace{
  height: 100px;
  width: 100%;
}

.actionbtn{
  display: flex;
  justify-content: space-evenly;
  position: sticky;
  bottom: 20px;
  z-index: 30;
  align-items: baseline;
}

.isvalidated{
  border-left: 5px solid green;
}
</style>
