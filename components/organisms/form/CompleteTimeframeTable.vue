<template>
  <div>
    <v-data-table :headers="headers" :items="timeframes" dense>
      <template #[`item.date`]="{ item }">
        {{ new Date(item.start).toDateString() }}
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
        <v-btn icon @click="editTimeframe(index)">
          <v-icon>mdi-account-multiple-plus-outline</v-icon>
        </v-btn>
      </template>
      <template #[`item.required`]="{ item }">
        <v-list dense>
          <v-list-item v-for="(required, index) in item.required" :key="index">
            <v-list-item-content>
              <v-list-item-title v-if="required.type === 'team'"
                >{{ required.amount }} {{ required.team }}
              </v-list-item-title>
              <v-list-item-title v-else-if="required.type === 'user'">{{
                required.user.username
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-data-table>

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
                <v-list-item-title v-if="required.type === 'team'"
                  >{{ required.amount }} {{ required.team }}
                </v-list-item-title>
                <v-list-item-title v-else-if="required.type === 'user'">{{
                  required.user.username
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
      { text: "date", value: "date" },
      { text: "debut", value: "start" },
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

    required: {
      type: undefined,
      team: undefined,
      amount: 1,
      user: {
        username: undefined,
        _id: undefined,
      },
    },
  }),
  computed: {
    timeframes: function () {
      return this.store.mFT ? this.store.mFT.timeframes : [];
    },
  },

  methods: {
    editTimeframe(index) {
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

    addUser() {
      if (this.selectedTimeframe.required === undefined) {
        this.selectedTimeframe.required = [];
      }
      this.required.amount = +this.required.amount;
      this.required.type = "user";
      delete this.required.team;
      this.selectedTimeframe.required.push({ ...this.required });
      this.store.updateTimeframe({
        index: this.selectedTimeframeIndex,
        timeframe: this.selectedTimeframe,
      });
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
