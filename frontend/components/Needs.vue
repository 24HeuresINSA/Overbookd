<template>
  <div>
    <v-row class="my-6 font-weight-bold">
      <v-col sm="2">Equipe</v-col>
      <v-col sm="7">
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
      <v-col sm="1" class="text-center">Total {{name}}s N</v-col>
      <v-col sm="1" class="text-center">Total {{ name }}s N-1</v-col>
      <v-col sm="1" class="text-center">%</v-col>
    </v-row>
    <v-row
        v-for="com in dataset"
        :key="com.team"
    >
      <v-col sm="2">{{ com.team }}</v-col>
      <v-col sm="7">
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
      <v-col sm="1" class="text-center">{{ com.total }}</v-col>
      <v-col sm="1" class="text-center">{{ history(com.team) }}</v-col>
      <v-col sm="1" class="text-center">{{ com.status['validated']/history(com.team) }}</v-col>
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
  data() {
    return {
      historyFA : {},
      historyFT: {
        bar : 75,
        barrieres : 45,
        catering : 6,
        communication : 20,
        concert : 23,
        courses : 77,
        culture : 73,
        DD : 50,
        deco : 10,
        elec : NaN,
        hard : NaN,
        humain : 12,
        log : 81,
        maman : NaN,
        payant : 17,
        plaizir : 63,
        scène : 57,
        secu : 70,
        signa : 24,
        sponso : 25,
        sports : 63
      }
    };
  },
  methods: {
    history(team){
      return this.name === 'FT' ? this.historyFT[team] || NaN : this.historyFA[team] || NaN;
    }
  }
};
</script>