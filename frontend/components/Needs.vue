<template>
  <div>
    <v-row class="my-6 font-weight-bold">
      <v-col sm="2">Equipe</v-col>
      <v-col sm="6">
        <v-row>
          <v-col sm="3">
            <NeedsCard status="draft">draft</NeedsCard>
          </v-col>
          <v-col sm="3">
            <NeedsCard status="refused">refused</NeedsCard>
          </v-col>
          <v-col sm="3">
            <NeedsCard status="submitted">submitted</NeedsCard>
          </v-col>
          <v-col sm="3">
            <NeedsCard status="validated">validated</NeedsCard>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="2">Total {{name}}s N</v-col>
      <v-col sm="2">Total {{ name }}s N-1</v-col>
    </v-row>
    <v-row
        v-for="com in dataset"
        :key="com.team"
    >
      <v-col sm="2">{{ com.team }}</v-col>
      <v-col sm="6">
        <div class="d-flex">
          <div
              v-for="(count,status) in com.status"
              :key="status"
              :style="`flex-grow: ${count}`"
          >
            <NeedsCard :status="status">
              {{ count }}
            </NeedsCard>
          </div>
        </div>
      </v-col>
      <v-col sm="2">{{ com.total }}</v-col>
      <v-col sm="2">No data available</v-col>
    </v-row>
  </div>
</template>

<script>
import NeedsCard from "./NeedsCard";

export default {
  components: {
    NeedsCard,
  },
  props: ['name', 'dataset'],
};
</script>