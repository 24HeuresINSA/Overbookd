<template>
  <div>
    <v-row
        v-for="com in dataset"
        :key="com._id"
        class="mb-6"
        no-gutters
    >
      <v-col>{{ com._id }}</v-col>
      <v-col>
        <div class="d-flex">
          <div
              v-for="status in com.status"
              :key="status.state"
              :style="`flex-grow: ${status.count}`"
          >
            <NeedsCard :status="status.state">
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
};
</script>