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
  TimeScale,
} from "chart.js";

export default defineNuxtPlugin(() => {
  Chart.register(
    CategoryScale,
    LinearScale,
    TimeScale,
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
