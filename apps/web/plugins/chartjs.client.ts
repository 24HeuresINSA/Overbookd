import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";

export default defineNuxtPlugin(() => {
  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend,
    Filler,
  );
});
