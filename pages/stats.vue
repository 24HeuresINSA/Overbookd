<template>
  <v-container>
    <h1>Stats 📈 (work in progess 🔨)</h1>
    <h2>Overbookd</h2>
    <h3>Nombre de crash</h3>
    <v-container style="height: 400px">
      <OverBarChart :chart-data="crashData"></OverBarChart>
    </v-container>

    <h2>FA</h2>
    <v-container style="height: 400px">
      <OverBarChart :chart-data="FAData"></OverBarChart>
    </v-container>

    <h2>FT</h2>
    <v-container style="height: 400px">
      <OverBarChart :chart-data="FTData"></OverBarChart>
    </v-container>
  </v-container>
</template>

<script>
import { hasRole } from "../common/role";
import overBarChart from "../components/overBarChart.js";

export default {
  name: "Stats",

  components: { overBarChart },

  data: () => {
    return {
      crashData: {
        labels: ["Overbookd", "Messenger"],
        datasets: [
          {
            label: "Nombre de crash",
            backgroundColor: "#f87979",
            data: [0, 1],
          },
        ],
        responsive: true,
        maintainAspectRatio: false,
      },
      FAData: {
        labels: ["Draft", "Soumis", "Valide", "l'année d'avant"],
        datasets: [
          {
            label: "Nombre de FA",
            backgroundColor: "rgba(206,119,236,0.45)",
            data: [0, 0, 0, 130],
          },
        ],
        responsive: true,
        maintainAspectRatio: false,
      },
      FTData: {
        labels: ["Draft", "Soumis", "Valide", "l'année d'avant"],
        datasets: [
          {
            label: "Nombre de FT",
            backgroundColor: "rgb(248,78,157)",
            data: [0, 0, 0, 927],
          },
        ],
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },

  mounted() {
    if (!hasRole(this, "hard")) {
      this.$router.push({
        path: "/",
      });
    }
  },
};
</script>

<style scoped></style>
