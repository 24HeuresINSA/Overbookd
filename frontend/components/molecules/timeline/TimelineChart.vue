<template>
  <div>
    <client-only>
      <LineChart :options="options" />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TimelineChart",
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20,
            },
          },
        ],
      },
    },
  }),
});
</script>
