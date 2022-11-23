<template>
  <div>
    <v-card :style="isDisabled ? `border-left: 5px solid green` : ``">
      <v-card-title>Créneaux</v-card-title>
      <v-card-subtitle
        >Pour créer un créneau clique et étire le créneau, une fois créé tu peux
        le déplacer
      </v-card-subtitle>

      <v-data-table :headers="headers" :items="timeframes" dense>
        <template #[`item.date`]="{ item }">
          {{ new Date(item.start).toLocaleDateString() }}
        </template>
        <template #[`item.start`]="{ item }">
          {{ new Date(item.start).toLocaleTimeString() }}
        </template>
        <template #[`item.dateEnd`]="{ item }">
          {{ new Date(item.end).toLocaleDateString() }}
        </template>
        <template #[`item.end`]="{ item }">
          {{ new Date(item.end).toLocaleTimeString() }}
        </template>
        <template #[`item.action`]="{ index, item }">
          <v-btn v-if="!isDisabled" icon>
            <v-icon @click="editTimeframe(item, index)">mdi-pencil</v-icon>
          </v-btn>
          <v-btn v-if="!isDisabled" icon>
            <v-icon @click="deleteTimeframe(index)">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <!--<TimeframeSelector
        :disabled="isDisabled"
        :store="store"
        @add-timeframe="addTimeframe"
        @set-timeframes="setTimeframes"
      ></TimeframeSelector>-->
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="openAddTimeframe">Ajouter un créneau</v-btn>
        </v-card-actions>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Ajouter un créneau</span>
        </v-card-title>
        <v-card-text>

          <v-date-picker v-model="date" mode="dateTime" is24hr>
            <template v-slot="{ inputValue, inputEvents }">
              <input
                class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
                :value="inputValue"
                v-on="inputEvents"
              />
            </template>
          </v-date-picker>


        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isAddDialogOpen = false">
            Annuler
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="isDisabled"
            @click="addTimeframe"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">Editer un créneau</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="mTimeframe.start"
            label="Début"
            type="time"
            :disabled="isDisabled"
          ></v-text-field>
          <v-text-field
            v-model="mTimeframe.end"
            label="Fin"
            type="time"
            :disabled="isDisabled"
          ></v-text-field>
          <v-btn text @click="selectMidnight">Minuit</v-btn>
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
  </div>
</template>

<script>
import TimeframeSelector from "~/components/molecules/timeframe/TimeframeSelector.vue";

export default {
  name: "TimeframeTable",
  components: { TimeframeSelector },
  props: {
    initTimeframes: {
      type: Array,
      default: () => [],
    },
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: function () {
    return {
      date: "",
      headers: [
        { text: "Date", value: "date" },
        { text: "Début", value: "start" },
        {
          text: "Date de fin",
          value: "dateEnd",
        },
        {
          text: "Fin",
          value: "end",
        },
        { text: "Action", value: "action" },
      ],
      store: this.$accessor.FA,
      isAddDialogOpen: false,
      isEditDialogOpen: false,
      mTimeframe: {},
    };
  },
  computed: {
    mFA: function () {
      return this.$accessor.FA.mFA;
    },
    timeframes: function () {
      return this.$accessor.FA.mFA.timeframes;
    },
  },
  methods: {
    selectMidnight() {
      this.mTimeframe.end = "23:59";
    },
    setTimeframes(timeframes) {
      const store = this.$accessor.FA;
      store.addTimeframes(timeframes);
    },
    editTimeframe(timeframe, index) {
      this.isEditDialogOpen = true;
      this.mTimeframe = { ...timeframe };
      this.mIndex = index;
    },
    updateTimeframe() {
      let start = new Date(this.timeframes[this.mIndex].start);
      let end = new Date(this.timeframes[this.mIndex].end);

      start.setHours(
        this.mTimeframe.start.split(":")[0],
        this.mTimeframe.start.split(":")[1]
      );
      end.setHours(
        this.mTimeframe.end.split(":")[0],
        this.mTimeframe.end.split(":")[1]
      );

      if (start > end) {
        alert("La date de début doit être inférieure à la date de fin");
        return;
      }
      if (start === end) {
        alert("La date de début doit être différente de la date de fin");
        return;
      }
      if (
        (+this.mTimeframe.end.split(":")[1] % 15 !== 0 ||
          +this.mTimeframe.start.split(":")[1] % 15 !== 0) &&
        !(
          this.mTimeframe.end.split(":")[1] === "59" &&
          this.mTimeframe.end.split(":")[0] === "23"
        )
      ) {
        alert("Les minutes doivent être divisible par 15");
        return;
      }

      this.deleteTimeframe(this.mIndex);
      this.addTimeframe({
        name: this.mTimeframe.name,
        start,
        end,
        timed: true,
      });

      this.isEditDialogOpen = false;
    },

    openAddTimeframe() {
      this.isAddDialogOpen = true;
    },
    addTimeframe() {
      this.isAddDialogOpen = false;
      //this.$accessor.FA.addTimeframe(timeframe);
    },
    deleteTimeframe(index) {
      this.$accessor.FA.deleteTimeframe(index);
    },
  },
};
</script>

<style scoped></style>
