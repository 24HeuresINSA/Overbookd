<template>
  <div>
    <v-data-table :headers="headers" :items="timeframes" dense>
      <template #[`item.dateStart`]="{ item }">
        {{ new Date(item.start).toDateString() }}
      </template>
      <template #[`item.dateEnd`]="{ item }">
        {{ new Date(item.end).toDateString() }}
      </template>
      <template #[`item.start`]="{ item }">
        {{ formatMilliToLocalTime(item.start) }}
      </template>
      <template #[`item.end`]="{ item }">
        {{ formatMilliToLocalTime(item.end) }}
      </template>
      <template #[`item.action`]="{ index }">
        <v-btn v-if="!isDisabled" icon>
          <v-icon @click="deleteTimeframe(index)">mdi-trash-can</v-icon>
        </v-btn>
        <v-btn icon @click="editTimeframeRequirements(index)">
          <v-icon>mdi-account-multiple-plus-outline</v-icon>
        </v-btn>
        <v-btn icon @click="editTimeframe(index)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template #[`item.required`]="{ index, item }">
        <v-list dense>
          <v-list-item v-for="(req, i) in item.required" :key="i">
            <v-list-item-content>
              <v-list-item-title>{{ formatText(req) }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="removeRequirement(i, index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
      <!-- Partition displays "-" if it is not defined or false and the slot time else -->
      <template #[`item.toSlice`]="{ item }">{{
        item.toSlice === undefined || item.toSlice === false
          ? "-"
          : `${item.sliceTime}h`
      }}</template>
    </v-data-table>

    <!-- Dialog to edit a single timeslot -->
    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Editer une plage</span>
        </v-card-title>
        <v-form v-model="validTimeframeEdit" lazy-validation>
          <v-card-text>
            <v-text-field
              v-model="mTimeframe.start"
              label="Début"
              type="datetime-local"
              :disabled="isDisabled"
              :rules="dateTimeValidationRules()"
              required
            ></v-text-field>
            <v-text-field
              v-model="mTimeframe.end"
              label="Fin"
              type="datetime-local"
              :disabled="isDisabled"
              :rules="dateTimeValidationRules()"
              required
            ></v-text-field>
            <v-checkbox
              v-model="mTimeframe.toSlice"
              label="Découper"
            ></v-checkbox>
            <v-slider
              v-model="mTimeframe.sliceTime"
              label="Nombre d'heures par decoupage"
              :disabled="!mTimeframe.toSlice"
              min="0.5"
              max="4"
              step="0.5"
              thumb-label="always"
            ></v-slider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="isEditDialogOpen = false">
              Annuler
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="isDisabled || !validTimeframeEdit"
              @click="updateTimeframe"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Orga selection pop up -->
    <v-dialog v-model="requireDialog" max-width="600">
      <v-card>
        <v-card-title>Orga Requis</v-card-title>
        <v-card-text>
          <h3>Ajouter un Orga</h3>
          <OverField
            :field="{ key: 'user', label: 'orga', type: 'user' }"
            @value="updateUser"
          ></OverField>
          <v-btn text @click="addUser">demander l'orga</v-btn>
          <OverField
            :field="{ key: 'team', label: 'team', type: 'teams' }"
            @value="updateTeam"
          ></OverField>
          <v-text-field
            v-model="required.amount"
            type="number"
            label="Nombre"
          ></v-text-field>
          <v-btn text @click="addTeam">demander une team</v-btn>
          <v-select
            v-model="required.equipment"
            :items="['12m2', '20m2']"
            label="Camions"
          >
          </v-select>
          <v-btn text @click="addEquipement">demander un camion</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import OverField from "../../overField";

const DEFAULT_SLICE_TIME = 2;

export default {
  name: "CompleteTimeframeTable",
  components: { OverField },
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    headers: [
      { text: "date début", value: "dateStart" },
      { text: "debut", value: "start" },
      { text: "date fin", value: "dateEnd" },
      {
        text: "fin",
        value: "end",
      },
      { text: "découpage", value: "toSlice" },
      { text: "requit", value: "required" },
      { text: "affecter", value: "assigned" },
      { text: "action", value: "action" },
    ],
    requireDialog: false,
    selectedTimeframeIndex: 0,
    selectedTimeframe: {},

    // indicate if the new timeframe inputs in the form is valid
    validTimeframeEdit: false,

    isEditDialogOpen: false,

    mTimeframe: {
      start: "",
      end: "",
    },
    date: {
      start: "",
      end: "",
    },

    required: {
      type: undefined,
      team: undefined,
      amount: 1,
      user: {
        username: undefined,
        _id: undefined,
      },
      equipment: undefined,
    },
  }),
  computed: {
    timeframes() {
      return this.$accessor.FT.mFT.timeframes;
    },
  },
  watch: {
    isEditDialogOpen: function (val) {
      // If switched to false
      if (!val) {
        // Reset the dialog related content
        this.mTimeframe = {};
        this.selectedTimeframeIndex = -1;
        this.validTimeframeEdit = false;
      }
    },
  },
  methods: {
    /**
     * Format date in milliseconds to ##:## 24h formatted time
     * @param milli String date in milliseconds
     * @returns String time stringified in format hh:mm
     */
    formatMilliToLocalTime(milli) {
      return new Date(milli).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    /**
     * @param milli Number date in milliseconds
     * @returns String date stringified in format yyyy-mm-ddThh:mm in local time
     */
    formatMilliToLocalDate(milli) {
      var tzoffset = new Date(milli).getTimezoneOffset() * 60000;
      return new Date(milli - tzoffset).toISOString().slice(0, -8); // remove offset, seconds and milliseconds
    },
    /**
     * @param date String date stringified in format yyyy-mm-ddThh:mm in local time
     * @returns Number date in milli, offset is automatically set
     */
    formatLocalDatetoMilli(date) {
      return new Date(date).getTime();
    },
    /**
     * @returns Array<Function> Array of validation rules for datetime-local inputs
     */
    dateTimeValidationRules() {
      return [
        // Pattern regexp matching
        (v) =>
          /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/.test(v) ||
          "Entrez une date valide",
      ];
    },
    editTimeframeRequirements(index) {
      this.selectedTimeframeIndex = index;
      this.selectedTimeframe = this.timeframes[index];
      this.requireDialog = true;
    },

    updateUser(user) {
      this.required.type = "user";
      this.required.user = { ...user }.value;
    },

    updateTeam(team) {
      delete this.required.user;
      this.required.type = "team";
      this.required.team = { ...team }.value;
    },

    async removeRequirement(requirementIndex, timeframeIndex) {
      await this.$accessor.FT.deleteRequirement({
        timeframeIndex,
        requirementIndex,
      });
    },

    /**
     * Open timeFrame edit dialog and store current timeFrame
     */
    editTimeframe(index) {
      this.selectedTimeframeIndex = index;
      this.mTimeframe = { ...this.timeframes[index] };

      // Adapt format because input type datetime-local does not handle milliseconds format
      this.mTimeframe.start = this.formatMilliToLocalDate(
        this.mTimeframe.start
      );
      this.mTimeframe.end = this.formatMilliToLocalDate(this.mTimeframe.end);

      // Default value for sliceTime
      this.mTimeframe.sliceTime =
        this.mTimeframe.sliceTime || DEFAULT_SLICE_TIME;

      this.isEditDialogOpen = true;
    },
    /**
     * Update Timeframe in store with the current mTimeframe's values
     */
    updateTimeframe() {
      // Format back timeFrame to the correct milliseconds format
      this.mTimeframe.start = this.formatLocalDatetoMilli(
        this.mTimeframe.start
      );
      this.mTimeframe.end = this.formatLocalDatetoMilli(this.mTimeframe.end);

      // update the store
      this.$accessor.FT.updateTimeframe({
        index: this.selectedTimeframeIndex,
        timeframe: this.mTimeframe,
      });

      // Reset
      this.isEditDialogOpen = false;
    },

    addUser() {
      if (this.selectedTimeframe.required === undefined) {
        this.selectedTimeframe.required = [];
      }
      this.required.amount = +this.required.amount;
      this.required.type = "user";
      delete this.required.team;
      let mTimeframe = { ...this.selectedTimeframe };
      this.$accessor.FT.addRequirement({
        timeframeIndex: this.selectedTimeframeIndex,
        requirement: this.required,
      });
      this.resetRequirement();
    },

    deleteTimeframe(timeframe) {
      this.$accessor.FT.deleteTimeframe(timeframe);
    },

    addEquipement() {
      if (this.selectedTimeframe.required === undefined) {
        this.selectedTimeframe.required = [];
      }
      this.required.amount = 1;
      this.required.type = "equipment";
      delete this.required.team;
      this.selectedTimeframe.required.push({ ...this.required });
      this.store.updateTimeframe({
        index: this.selectedTimeframeIndex,
        timeframe: this.selectedTimeframe,
      });
    },

    formatText(requirements) {
      if (!requirements.type) {
        return "";
      }
      switch (requirements.type) {
        case "user":
          return requirements.user.username;
        case "team":
          return requirements.amount + " " + requirements.team;
        case "equipment":
          return requirements.equipment;
        default:
          return requirements.type;
      }
    },

    resetRequirement() {
      this.required = {
        type: undefined,
        team: undefined,
        amount: 1,
        user: {
          username: undefined,
          _id: undefined,
        },
        equipment: undefined,
      };
    },

    addTeam() {
      if (this.selectedTimeframe.required === undefined) {
        this.selectedTimeframe.required = [];
      }
      this.required.amount = +this.required.amount;
      this.required.type = "team";
      delete this.required.user;
      this.store.addRequirement({
        timeframeIndex: this.selectedTimeframeIndex,
        requirement: this.required,
      });
      this.resetRequirement();
    },
  },
};
</script>

<style scoped></style>
