<template>
  <div
    v-if="!disabled"
    style="
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    "
  >
    <v-date-picker
      v-model="mTimeframe.date"
      first-day-of-week="1"
    ></v-date-picker>
    <div style="display: flex; flex-direction: column">
      <v-select
        v-model="mTimeframe.start"
        label="début"
        :items="possibleTimeframes"
        item-text="text"
        item-value="time"
        dense
      ></v-select>
      <v-select
        v-model="mTimeframe.end"
        label="fin"
        :items="possibleTimeframes"
        item-text="text"
        item-value="time"
        dense
      ></v-select>
    </div>
    <div style="display: flex; flex-direction: column">
      <v-btn text @click="addTimeframe">ajouter</v-btn>
      <v-btn text>ajouter toute la jounée</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeframeSelector",
  props: {
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data: () => ({
    possibleTimeframes: [],
    mTimeframe: {
      date: undefined,
      start: undefined,
      end: undefined,
    },
    eventDate: undefined,
  }),
  mounted() {
    this.mTimeframe.date = this.$accessor.config.getConfig("event_date"); // center on event date
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        this.possibleTimeframes.push({
          text: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          time: {
            hour,
            minute,
          },
        });
      }
    }
  },
  methods: {
    addTimeframe() {
      const timeframe = {
        start: new Date(this.mTimeframe.date),
        end: new Date(this.mTimeframe.date),
      };
      timeframe.start.setHours(this.mTimeframe.start.hour);
      timeframe.start.setMinutes(this.mTimeframe.start.minute);
      timeframe.end.setHours(this.mTimeframe.end.hour);
      timeframe.end.setMinutes(this.mTimeframe.end.minute);

      this.$emit("add-timeframe", timeframe);

      this.mTimeframe = {
        date: undefined,
        start: undefined,
        end: undefined,
      };
    },
    addFullDay() {
      const timeframe = {
        start: new Date(this.mTimeframe.date),
        end: new Date(this.mTimeframe.date),
      };
      timeframe.end.setDate(timeframe.end.getDate() + 1);

      this.$emit("add-timeframe", timeframe);
      this.mTimeframe = {
        date: undefined,
        start: undefined,
        end: undefined,
      };
    },
  },
};
</script>

<style scoped></style>
