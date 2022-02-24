<template>
  <div>
    <v-row
        v-for="(com,index) in dataset"
        class="mb-6"
        no-gutters
    >
      <v-col>{{ index }}</v-col>
      <v-col>
        <div class="d-flex">
          <div
              v-for="status in sortLabel(com)"
              :key="status.status"
              :style="`flex-grow: ${status.count}`"
          >
            <NeedsCard :status="status.status">
              {{ status.count }}
            </NeedsCard>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NeedsCard from "./NeedsCard";

export default {
  components: {
    NeedsCard,
  },
  props: ['dataset'],
  data() {
    return {
      possibleStatus: {
        'draft': 1,
        'refused': 2,
        'submitted': 3,
        'validated': 4
      },
    }
  },
  methods: {
    sortLabel(c) {
      return c.sort((a,b) => this.possibleStatus[a.status] - this.possibleStatus[b.status]);
    }
  }
};
</script>