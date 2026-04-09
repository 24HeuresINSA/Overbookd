import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
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
