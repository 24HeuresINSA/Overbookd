<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template #activator="{ on }">
      <v-btn color="primary" dark class="mx-auto" v-on="on">
        <v-icon left>mdi-clock-outline</v-icon> Ajout de multiples créneaux
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Ajout de multiple créneaux</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col>
                <v-text-field
                    v-model="title"
                    label="Titre"
                    required
                    :rules="groupTitleRules"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                    v-model="charisma"
                    type="number"
                    label="Charisme"
                    single-line
                    :rules="charismaRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="d-flex justify-center">
              <v-switch
                  v-model="forHard"
                  label="Créneau uniquement pour les hards"
              ></v-switch>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                    v-model="description"
                    label="Description"
                    required
                    :rules="groupDescriptionRules"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <OverDatePicker
                    label="Date de début"
                    @update:date="dayStart = $event"
                >
                </OverDatePicker>
                <OverDatePicker
                    label="Date de fin"
                    @update:date="dayEnd = $event"
                >
                </OverDatePicker>
              </v-col>
              <v-col>
                <OverTimePicker
                    label="Heure de début"
                    @update:time="hourStart = $event"
                ></OverTimePicker>
                <OverTimePicker
                    label="Heure de fin"
                    @update:time="hourEnd = $event"
                ></OverTimePicker>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">Annuler</v-btn>
        <v-btn color="primary" text @click="addOverTimeslot()">Ajouter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from "vue";
import OverDatePicker from "../atoms/OverDatePicker.vue";
import OverTimePicker from "../atoms/OverTimePicker.vue";

export default Vue.extend({
  name: "TimeslotAdder",
  components: {
    OverDatePicker,
    OverTimePicker,
  },
  data() {
    return {
      dialog: false,
      title: "",
      forHard: false,
      description: "",
      hourStart: "",
      hourEnd: "",
      dayStart: "",
      dayEnd: "",
      charisma: 10,
      valid: false,
      groupTitleRules: [
        (v) => !!v || "Title is required",
        (v) => (v && v.length <= 50) || "Title must be less than 50 characters",
      ],
      groupDescriptionRules: [(v) => !!v || "Description is required"],
      charismaRules: [
        (v) => !!v || "Charisma is required",
        (v) => (v && v >= 0) || "Charisma must be greater than 0",
      ],
    };
  },
  methods: {
    addOverTimeslot() {
      this.$refs.form.validate();
      /* eslint no-constant-condition: "off" */
      if (!this.valid) return;
      let start = new Date(this.dayStart + "T" + this.hourStart + ":00");
      const end = new Date(this.dayEnd + "T" + this.hourEnd + ":00");
      if (start.getTime() > end.getTime()) {
        this.$store.dispatch(
            "timeslot/setCreateStatus",
            "La date de fin doit être supérieure à la date de début"
        );
        return;
      }
      const timeslots = [];
      while (true) {
        const newEnd = new Date(start);
        newEnd.setHours(newEnd.getHours() + 2);
        if (newEnd > end) {
          break;
        }
        timeslots.push({
          timeFrame: {
            start: start,
            end: newEnd,
          },
          groupTitle: this.title,
          groupDescription: this.description,
          charisma: this.charisma,
          forHardOnly: this.forHard
        });
        start = new Date(newEnd);
      }
      console.log(timeslots);
      this.$store.dispatch("timeslot/addTimeslots", timeslots);
      this.dialog = false;
    },
  },
});
</script>

<style></style>