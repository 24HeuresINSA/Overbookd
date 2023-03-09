<template>
  <div>
    <div>
      <h1>Rapport des besoins en orgas</h1>
      <p>
        Orgas disponibles | Orgas disponibles validés - Orgas nécessaires toute
        FT | Orgas nécessaires FT validées (Orgas affectés)
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
          >{{ i + 1 }}
        </v-btn>
      </v-btn-toggle>
    </div>
    <div>
      <div class="d-flex">
        <div style="width: 5rem"></div>
        <div v-for="day in days" :key="day.dayName" style="width: 12rem">
          {{ day.dayName }}
        </div>
      </div>
      <div v-for="i in Array.from(Array(96).keys())" :key="i" class="d-flex">
        <div style="width: 5rem">
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
          :key="day.dayName"
          :style="`width: 12rem; white-space:nowrap; color: ${getColor(
            day.data[i]
          )};`"
        >
          {{ day.data[i].availableCount }} |
          {{ day.data[i].availableValidCount }} -
          {{ day.data[i].requireCount }} |
          {{ day.data[i].requireValidatedCount }} ({{
            day.data[i].affectedCount
          }})
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { safeCall } from "../utils/api/calls";
import { RepoFactory } from "../repositories/repoFactory";

export default {
  name: "OrgaNeeds",
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
      for (const datepicker of this.datepicker) {
        if (
          !this.displayed.includes(datepicker) &&
          !this.loading.includes(datepicker)
        ) {
          // load the day
          this.loading.push(datepicker);
          const timestamp = new Date(
            new Date().getFullYear(),
            4,
            datepicker + 1
          ).getTime();
          await safeCall(
            this.$store,
            RepoFactory.timeslotRepo.getOrgaNeeds(this, timestamp)
          ).then((res) => {
            if (res.data.length > 0) {
              // add it to the displayed
              this.displayed.push(datepicker);
              this.days.push({
                dayName: new Date(timestamp).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                }),
                data: res.data,
              });
              this.loading.splice(this.loading.indexOf(datepicker), 1);
            }
          });
        }
      }
      // if displayed contains a value that is not in datepicker, remove it
      for (const datepicker of this.displayed) {
        if (!this.datepicker.includes(datepicker)) {
          this.displayed.splice(this.displayed.indexOf(datepicker), 1);
          this.days.splice(this.displayed.indexOf(datepicker), 1);
        }
      }
    },
    getColor(data) {
      if (data.affectedCount >= data.requireValidatedCount) {
        return "#0066ff";
      } else if (data.availableValidCount >= data.requireCount + 5) {
        return "green";
      } else if (data.availableValidCount >= data.requireCount) {
        return "#00cc66";
      } else if (data.availableValidCount >= data.requireCount - 5) {
        return "#ff7f7f";
      } else {
        return "red";
      }
    },
  },
};
</script>

<style scoped></style>
