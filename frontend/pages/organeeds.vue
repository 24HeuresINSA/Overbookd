<template>
  <div>
    <div>
      <h1>Rapport des besoins en orgas</h1>
      <p>
        Orgas disponibles - Orgas nécessaires toute FT | Orgas nécessaires FT
        validées (Orgas affectés)
      </p>
    </div>
    <div class="d-flex">
      <v-btn-toggle
        v-model="datepicker"
        class="justify-center"
        multiple
        dense
        @change="loadDay"
      >
        <v-btn
          v-for="i in Array.from(Array(31).keys())"
          :key="i"
          class="flex-grow-1"
          >{{ i + 1 }}</v-btn
        >
      </v-btn-toggle>
    </div>
    <div>
      <div class="d-flex">
        <div style="width: 10%"></div>
        <div v-for="day in days" style="width: 10%">
          {{ day.dayName }}
        </div>
      </div>
      <div v-for="i in Array.from(Array(96).keys())" :key="i" class="d-flex">
        <div style="width: 10%">
          {{
            new Date(i * 15 * 60 * 1000 - 60 * 60 * 1000).toLocaleTimeString(
              "fr-FR",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )
          }}
        </div>
        <div
          v-for="day in days"
          :style="`width: 10%; color: ${getColor(day.data[i])};`"
        >
          {{ day.data[i].availableCount }} - {{ day.data[i].requireCount }} |
          {{ day.data[i].requireValidatedCount }} ({{
            day.data[i].affectedCount
          }})
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {safeCall} from "../utils/api/calls";
import {RepoFactory} from "../repositories/repoFactory";

export default {
  name: "organeeds.vue",
  data() {
    return {
      datepicker: [19, 20, 21, 22],
      displayed: [],
      days: [],
      loading: [],
    };
  },
  mounted() {
    this.loadDay();
  },
  methods: {
    async loadDay() {
      for (let i = 0; i < this.datepicker.length; i++) {
        if (
          !this.displayed.includes(this.datepicker[i]) &&
          !this.loading.includes(this.datepicker[i])
        ) {
          // load the day
          this.loading.push(this.datepicker[i]);
          const timestamp = new Date(
            new Date().getFullYear(),
            4,
            this.datepicker[i] + 1
          ).getTime();
          await safeCall(
            this.$store,
            RepoFactory.timeslotRepo.getOrgaNeeds(this, timestamp)
          ).then((res) => {
            if (res.data.length > 0) {
              // add it to the displayed
              this.displayed.push(this.datepicker[i]);
              this.days.push({
                dayName: new Date(timestamp).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }),
                data: res.data,
              });
              this.loading.splice(this.loading.indexOf(this.datepicker[i]), 1);
            }
          });
        }
      }
      // if displayed contains a value that is not in datepicker, remove it
      for (let i = 0; i < this.displayed.length; i++) {
        if (!this.datepicker.includes(this.displayed[i])) {
          this.displayed.splice(i, 1);
          this.days.splice(i, 1);
        }
      }
    },
    getColor(data) {
      if (data.affectedCount >= data.requireValidatedCount) {
        return "#0066ff";
      } else if (data.availableCount >= data.requireCount + 5) {
        return "green";
      } else if (data.availableCount >= data.requireCount) {
        return "#00cc66";
      } else if (data.availableCount >= data.requireCount - 5) {
        return "#ff7f7f";
      } else {
        return "red";
      }
    },
  },
};
</script>

<style scoped></style>
