<template>
  <v-container style="display: grid">
    <h1>Fiche Tâche</h1>

    <v-row>
      <v-col md="12">
        <v-container
          style="
            display: flex;
            align-content: baseline;
            justify-content: space-between;
          "
        >
          <h2>
            {{ FT.isValid === false ? "[DELETED]" : "" }}FT: {{ FT.count }}
          </h2>
          <h2>{{ FT ? FT.status : "draft" }}</h2>
          <v-icon
            v-for="(validator, i) of validators"
            :key="i"
            :color="getIconColor(validator)"
          >
            {{ getValidatorIcon(validator) }}
          </v-icon>
        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="6">
        <FormCard
          title="Général"
          topic="general"
          form-key="ft_general_form"
          :form="FT"
          :is-disabled="isValidated('humain')"
          @form-change="updateForm('general', $event)"
        ></FormCard>
      </v-col>

      <v-col md="6">
        <FTInfoCard></FTInfoCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <FormCard
          title="Détail"
          topic="details"
          form-key="ft_details_form"
          :form="FT"
          :is-disabled="isValidated('humain')"
          @form-change="updateForm('details', $event)"
        ></FormCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <CompleteTimeframeCard
          :store="store"
          :is-disabled="isValidated('humain')"
        ></CompleteTimeframeCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col md="12">
        <LogisticsCard
          title="Matos"
          :types="Object.values(SMALL_TYPES)"
          :disabled="isValidated('log')"
          :store="store"
        ></LogisticsCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <CommentCard :comments="FT.comments" form="FT"></CommentCard>
      </v-col>
    </v-row>

    <br />

    <v-dialog v-model="isDialogOpen.refused" max-width="300">
      <v-card>
        <v-card-title>Refuser la FT</v-card-title>
        <v-card-text>
          <v-textarea v-model="refusedComment"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="refuse(v)">refuser</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDialogOpen.submit" width="600px">
      <v-card>
        <v-img src="img/memes/submit_FT.gif" height="300px"></v-img>
        <v-card-title>t'es sur de ta FT ?</v-card-title>
        <v-card-actions>
          <v-btn text @click="isDialogOpen.submit = false">Non</v-btn>
          <v-btn text @click="submitForReview">je suis sûr</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div style="height: 50px; width: 100%"></div>

    <!-- Buttons bar at the bottom of the page -->

    <div
      style="
        display: flex;
        justify-content: space-evenly;
        align-items: baseline;
        position: sticky;
        bottom: 20px;
        z-index: 30;
      "
    >
      <v-btn v-if="FT.count > 1" small fab :href="`/ft/${FT.count - 1}`">
        <v-icon small>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn
          v-if="hasRole('humain') || FT.status !== 'ready'"
          color="red"
          @click="readyForAssignment"
      >prêt pour affectation
      </v-btn>
      <v-btn
          v-if="validators.length === 1"
          color="red"
          @click="
          v = validators[0];
          isDialogOpen.refused = true;
        "
      >refusé par {{ validators[0] }}
      </v-btn>
      <v-menu v-if="validators.length > 1" offset-y>
        <template #activator="{ attrs, on }">
          <v-btn class="white--text ma-5" v-bind="attrs" color="red" v-on="on">
            Refuser
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="validator of validators" :key="validator" link>
            <v-list-item-title
              @click="
                v = validator;
                isDialogOpen.refused = true;
              "
              v-text="validator"
            ></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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

      <v-btn
          v-if="FT.status === 'draft' || FT.status === 'refused'"
          color="secondary"
          @click="isDialogOpen.submit = true"
      >Soumettre a validation
      </v-btn>
      <v-btn color="warning" @click="saveFT">sauvegarder</v-btn>
      <v-btn small fab :href="`/ft/${FT.count + 1}`">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <SnackNotificationContainer></SnackNotificationContainer>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {Snack} from "~/utils/models/snack";
import {Header} from "~/utils/models/Data";
import {User} from "~/utils/models/repo";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import FTInfoCard from "~/components/FTInfoCard.vue";
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";
import CompleteTimeframeCard from "~/components/organisms/form/CompleteTimeframeCard.vue";
import FormCard from "~/components/organisms/form/FormCard.vue";
import {FT, SmallTypes} from "~/utils/models/FT";
import SnackNotificationContainer from "~/components/molecules/snackNotificationContainer.vue";

interface Data {
  FTID: number;

  isDialogOpen: {
    refused: boolean;
    assignment: boolean;
    submit: boolean;
    equipment: boolean;
  };

  schedules: any[];

  refusedComment: string;
  snack: Snack;
  feedbacks: { [key: string]: string };
  selectedTimeframeIndex: number | null;
  equipmentsHeader: Header[];
  color: { [key: string]: string };
  v: string | null;
  SMALL_TYPES: typeof SmallTypes;
}

const feedbacks = {
  validate: "FT validée ",
  refused: "FT refusée  🥺",
  save: "FT sauvegardée",
  submitted: "FT soumise à validation 🥵 may the odds be with you",
};

const color = {
  submitted: "grey",
  validated: "green",
  refused: "red",
  ready: "orange",
};

export interface schedule {
  start: Date;
  end: Date;
}

export default Vue.extend({
  name: "Ft",
  components: {
    SnackNotificationContainer,
    FormCard,
    CommentCard,
    CompleteTimeframeCard,
    FTInfoCard,
    LogisticsCard,
  },
  data: function (): Data {
    return {
      FTID: +this.$route.params.ft, // count
      schedules: [],
      refusedComment: "",

      isDialogOpen: {
        refused: false,
        assignment: false,
        submit: false,
        equipment: false,
      },

      snack: new Snack(),

      selectedTimeframeIndex: null,
      feedbacks,
      v: null,

      equipmentsHeader: [
        { text: "item", value: "name" },
        { text: "sélectionné", value: "selectedAmount" },
      ],
      color,
      SMALL_TYPES: SmallTypes,
    };
  },
  computed: {
    FT: function (): FT {
      return this.$accessor.FT.mFT;
    },
    me: function (): User {
      return this.$accessor.user.me;
    },
    store: function (): any {
      return this.$accessor.FT;
    },
    validators: function (): string[] {
      let mValidators: string[] = [];
      const allValidators: string[] =
        this.$accessor.config.getConfig("ft_validators");
      if (this.me.team.includes("admin")) {
        // admin has all the validators powers
        console.log(allValidators);
        return allValidators;
      }
      if (allValidators) {
        allValidators.forEach((val) => {
          if (this.me.team && this.me.team.includes(val)) {
            mValidators.push(val);
          }
        });
        return mValidators;
      }
      return [];
    },
  },

  async mounted() {
    // fetch FT and conficts
    await this.$accessor.FT.getAndSetFT(this.FTID);
    await this.$accessor.conflict.fetchConflictsByFTCount(this.FTID);
    document.title = "FT:" + this.FTID;
  },

  methods: {
    readyForAssignment() {
      // Check for conflicts
      if (this.$accessor.conflict.conflicts.length != 0) {
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "Attention il reste des conflits pour cette FT",
        });
        return;
      }
      this.$accessor.FT.readyForAssignment(this.me.lastname);
    },
    getIconColor(validator: string): string | undefined {
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

    getConfig(key: string) {
      return this.$accessor.config.getConfig(key);
    },

    isValidated(validator: string): boolean {
      return this.FT.validated.find((v) => v === validator) !== undefined;
    },

    hasRole(role: string) {
      return this.$accessor.user.hasRole(role);
    },

    async saveFT() {
      await this.$accessor.FT.saveFT();
      // todo check if the request did succeed
      this.snack.display("FT sauvegardée 🥳");
      await this.$accessor.conflict.fetchConflictsByFTCount(this.FTID);
    },

    updateForm(section: keyof FT, form: any) {
      let newForm: Partial<FT> = {};
      newForm[section] = form;
      this.$accessor.FT.assignFT(newForm);
    },

    getValidatorIcon(validator: string) {
      try {
        return this.getConfig("teams").find(
          (team: { name: string }) => team.name === validator
        ).icon;
      } catch (e) {
        console.log(`can't find icon of team ${validator}`);
      }
    },

    validate(validator: string) {
      this.$accessor.FT.validate(validator);
    },

    submitForReview() {
      this.$accessor.FT.submitForReview();
      this.isDialogOpen.submit = false;
    },

    refuse(validator: string) {
      if (validator) {
        this.$accessor.FT.refuse({
          validator,
          comment: this.refusedComment,
        });
        this.isDialogOpen.refused = false;
      }
    },
  },
});
</script>

<style scoped></style>
