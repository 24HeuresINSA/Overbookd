<template>
  <div class="small">
    <BarChart :chart-data="datacollection" :options="chartOptions"></BarChart>
    <button @click="fillData()">Randomize</button>
  </div>
</template>

<script>
import BarChart from "../utils/charts/BarChart.js";

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      datacollection: null,
      chartOptions: {
        responsive: true,
        scales: {
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: [
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
          this.getRandomInt(),
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#2af3fa",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            barThickness: "20",
          },
          {
            label: "Data Two",
            backgroundColor: "#f87979",
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ],
            barThickness: "20",
          },
        ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
