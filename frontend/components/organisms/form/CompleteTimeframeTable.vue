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
        {{ new Date(item.start).toLocaleTimeString() }}
      </template>
      <template #[`item.end`]="{ item }">
        {{ new Date(item.end).toLocaleTimeString() }}
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
        <v-btn icon @click="editTimeframe(index)">
          <v-icon>mdi-note-multiple</v-icon>
        </v-btn>
      </template>
      <template #[`item.required`]="{ item, index }">
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
    </v-data-table>

    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Editer un créneau</span>
        </v-card-title>
        <v-card-text>
          <v-date-picker
            v-model="date.start"
            label="Date de début"
            :disabled="isDisabled"
          ></v-date-picker>
          <v-text-field
            v-model="mTimeframe.start"
            label="Début"
            type="time"
            :disabled="isDisabled"
          ></v-text-field>
          <v-date-picker
            v-model="date.end"
            label="Date de fin"
            :disabled="isDisabled"
          ></v-date-picker>
          <v-text-field
            v-model="mTimeframe.end"
            label="Fin"
            type="time"
            :disabled="isDisabled"
          ></v-text-field>
          <!--          <v-btn text @click="selectMidnight">Minuit</v-btn>-->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isEditDialogOpen = false">
            Annuler
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="isDisabled"
            @click="updateTimeframe"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="requireDialog" max-width="600">
      <v-card>
        <v-card-title>Orga Requit</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item
              v-for="(required, index) in selectedTimeframe.required"
              :key="index"
            >
              <v-list-item-content>
                <v-list-item-title v-if="required.type === 'team'">
                  <p>{{ required.amount }} {{ required.team }}</p>
                  <v-btn icon small>a<v-icon></v-icon></v-btn>
                </v-list-item-title>
                <v-list-item-title v-else-if="required.type === 'user'">{{
                  required.user.username
                }}</v-list-item-title>
                <v-list-item-title v-else-if="required.type === 'equipment'">{{
                  required.equipment
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
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
      { text: "requit", value: "required" },
      { text: "affecter", value: "assigned" },
      { text: "action", value: "action" },
    ],
    requireDialog: false,
    selectedTimeframeIndex: 0,
    selectedTimeframe: {},

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
    timeframes: function () {
      return this.store.mFT ? this.store.mFT.timeframes : [];
    },
  },

  methods: {
    editTimeframeRequirements(index) {
      this.selectedTimeframeIndex = index;
      this.selectedTimeframe = this.timeframes[index];
      this.requireDialog = true;
    },

    updateUser(user) {
      this.required.type = "user";
      this.required.user = { ...user.value };
    },

    updateTeam(team) {
      this.required.type = "team";
      this.required.team = team.value;
    },

    async removeRequirement(requirementIndex, timeframeIndex) {
      await this.$accessor.FT.deleteRequirement({
        timeframeIndex,
        requirementIndex,
      });
    },

    editTimeframe(index) {
      this.selectedTimeframeIndex = index;
      this.mTimeframe = { ...this.timeframes[index] };
      this.isEditDialogOpen = true;
    },

    updateTimeframe() {
      if (
        !this.mTimeframe.start ||
        !this.mTimeframe.end ||
        !this.date.end ||
        !this.date.start
      ) {
        alert("Veuillez remplir tous les champs");
        return;
      }

      let oldTimeframe = { ...this.timeframes[this.selectedTimeframeIndex] };
      let start = new Date(this.date.start);
      let end = new Date(this.date.end);

      start.setHours(+this.mTimeframe.start.split(":")[0]);
      start.setMinutes(+this.mTimeframe.start.split(":")[1]);
      end.setHours(+this.mTimeframe.end.split(":")[0]);
      end.setMinutes(+this.mTimeframe.end.split(":")[1]);

      oldTimeframe.start = start.getTime();
      oldTimeframe.end = end.getTime();

      this.$accessor.FT.updateTimeframe({
        index: this.selectedTimeframeIndex,
        timeframe: oldTimeframe,
      });
      this.mTimeframe = {
        start: "",
        end: "",
      };
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
      // this.store.updateTimeframe({
      //   index: this.selectedTimeframeIndex,
      //   timeframe: mTimeframe,
      // });
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

    addTeam() {
      if (this.selectedTimeframe.required === undefined) {
        this.selectedTimeframe.required = [];
      }
      this.required.amount = +this.required.amount;
      this.required.type = "team";
      delete this.required.user;
      this.selectedTimeframe.required.push({ ...this.required });
      this.store.updateTimeframe({
        index: this.selectedTimeframeIndex,
        timeframe: this.selectedTimeframe,
      });
    },
  },
};
</script>

<style scoped></style>
