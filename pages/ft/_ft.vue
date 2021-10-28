<template>
  <div>
    <v-container
      style="
        display: flex;
        align-content: center;
        justify-content: space-between;
      "
    >
      <h1>Fiche Tache 🤩</h1>
      <h2>Status</h2>
    </v-container>

    <br />
    <FormCard
      title="Général"
      topic="general"
      form-key="ft_general_form"
      :form="FT"
      @form-change="updateForm('general', $event)"
    ></FormCard>

    <br />
    <FormCard
      title="Détail"
      topic="details"
      form-key="ft_details_form"
      :form="FT"
      @form-change="updateForm('details', $event)"
    ></FormCard>

    <br />
    <LogisticsCard title="Matos" type="petit" :store="store"> </LogisticsCard>

    <v-dialog v-model="isEquipmentDialogOpen">
      <v-card>
        <v-card-title>ajouter du matos</v-card-title>
        <v-card-text>
          <v-data-table :headers="equipmentsHeader" :items="availableEquipment">
            <template #[`item.selectedAmount`]="item">
              <v-text-field
                v-model="item.item.selectedAmount"
                type="number"
              ></v-text-field>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveEquipments">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isAssignmentDialogOpen" max-width="600px">
      <v-card>
        <v-card-title>Humains</v-card-title>
        <v-card-text>
          <template v-if="requiredHumans">
            <v-list-item v-for="(need, index) in requiredHumans" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ need }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>

          <h4>Affecter une personne</h4>
          <v-autocomplete
            v-model="assignedHuman"
            :items="usernames"
          ></v-autocomplete>
          <v-btn @click="addHuman()">ajouter</v-btn>
          <h4>Affecter un role</h4>
          <v-autocomplete
            v-model="assignedRole"
            label="role"
            :items="getConfig('teams').map((e) => e.name)"
          ></v-autocomplete>
          <v-text-field
            v-model="assignedAmount"
            label="Nombre"
            type="number"
          ></v-text-field>
          <v-btn @click="addRole()">ajouter</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="saveRequiredHuman()">💾</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isRefusedDialogOpen">
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

    <div style="display: flex; justify-content: space-evenly">
      <v-btn v-if="getValidator()" color="green" @click="validateFT"
        >validate
      </v-btn>
      <v-btn
        v-if="getValidator()"
        color="red"
        @click="isRefusedDialogOpen = true"
        >refuse
      </v-btn>
      <v-btn color="secondary" @click="isSubmitDialogOpen = true">submit</v-btn>
      <v-btn color="warning" @click="saveFT">sauvgarder</v-btn>
    </div>
  </div>
</template>

<script>
import { RepoFactory } from "~/repositories/repoFactory";
import FormCard from "../../components/organisms/form/FormCard";
import LogisticsCard from "../../components/organisms/form/LogisticsCard";

export default {
  name: "Ft",
  components: { LogisticsCard, FormCard },
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
    };
  },

  computed: {
    FT: function () {
      return this.$accessor.FT.mFT;
    },
  },

  async mounted() {
    // get FT and store it in store
    this.store = this.$accessor.FT;
    await this.store.getAndSetFT(this.FTID);
  },

  methods: {
    saveRequiredHuman() {
      this.$set(
        this.FT.schedules[this.selectedTimeframeIndex],
        "needs",
        this.requiredHumans
      );
      this.isAssignmentDialogOpen = false;
      console.log(this.FT.schedules);
    },

    addHuman() {
      this.requiredHumans.push(this.assignedHuman);
    },

    addRole() {
      this.requiredHumans.push({
        role: this.assignedRole,
        amount: this.assignedAmount,
      });
    },

    openAssignmentDialog(timeframeIndex) {
      this.selectedTimeframeIndex = timeframeIndex;
      this.requiredHumans = this.FT.schedules[timeframeIndex].needs
        ? this.FT.schedules[timeframeIndex].needs
        : [];
      this.isAssignmentDialogOpen = true;
    },

    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },

    getUser() {
      return this.$store.state.user.me;
    },

    hasRole(role) {
      const teams = this.getUser()?.team;
      if (teams === undefined) {
        return false;
      }
      return teams.includes(role);
    },

    getValidator() {
      let mValidator = null;
      this.FT_VALIDATORS.forEach((validator) => {
        if (this.hasRole(validator.name)) {
          mValidator = validator.name;
        }
      });
      return mValidator;
    },

    deleteSchedule(schedule) {
      this.FT.schedules = this.FT.schedules.filter((s) => {
        return (
          s.date !== schedule.date &&
          s.end !== schedule.end &&
          s.start !== schedule.start
        );
      });
    },

    addSchedule() {
      if (!this.FT.schedules) {
        this.$set(this.FT, "schedules", []);
      }
      this.schedule.start = new Date(
        this.schedule.date + " " + this.schedule.start
      );
      this.schedule.end = new Date(
        this.schedule.date + " " + this.schedule.end
      );
      this.$set(this.FT.schedules, this.FT.schedules.length, {
        ...this.schedule,
      });
    },

    saveEquipments() {
      this.selectedEquipment = [];
      this.availableEquipment.forEach((e) => {
        if (e.selectedAmount !== undefined) {
          this.selectedEquipment.push(e);
        }
      });
      this.FT.equipments = this.selectedEquipment;
      this.isEquipmentDialogOpen = false;
    },

    async saveFT() {
      await this.store.saveFT();
    },

    updateForm(section, form) {
      let newForm = {};
      newForm[section] = form;
      this.store.assignFT(newForm);
    },

    validateFT() {
      const validator = this.getValidator();
      if (this.FT.validated === undefined) {
        this.FT.validated = [];
      }
      if (this.FT.refused) {
        this.FT.refused = this.FA.refused.filter((e) => e !== validator);
      }
      this.FT.validated.push(validator);

      if (this.FT.validated.length === this.FT_VALIDATORS.length) {
        this.FT.status = "validated";
      }
      this.snackbarMessage = this.feedbacks.validate;
      this.isSnackbarOpen = true;
      this.saveFT();
    },

    submitForReview() {
      this.FT.status = "submitted";
      this.snackbarMessage = this.feedbacks.submitted;
      this.isSnackbarOpen = true;
      this.isSubmitDialogOpen = false;
      this.saveFT();
    },

    refuse() {
      this.FT.status = "refused";
      const validator = this.getValidator();
      if (this.FT.refused === undefined) {
        this.FT.refused = [];
      }
      this.FT.refused.push(validator);
      this.snackbarMessage = this.feedbacks.refused;
      this.isSnackbarOpen = true;
      this.isRefusedDialogOpen = false;
      this.saveFT();
    },
  },
};
</script>

<style scoped></style>
