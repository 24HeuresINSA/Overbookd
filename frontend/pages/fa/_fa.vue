<template>
  <div>
    <div class="main">
      <h1>Fiche Activité</h1>
    </div>
    <v-container class="container">
      <v-row>
        <v-col md="6">
          <FAGeneralCard
            :data="generalData"
            @update-data="updateGeneralData"
          ></FAGeneralCard>
        </v-col>
        <v-col md="6">
          <SignaCard></SignaCard>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <FADetailCard 
            :data="detailData"
            @update-data="updateDetailData"
          ></FADetailCard>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <TimeframeTable :store="store"></TimeframeTable>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <SecurityCard
            :data="securityData"
            @update-data="updateSecurityData"
          ></SecurityCard>
        </v-col>
        <v-col md="6">
          <PrestaCard
            :data="prestaData"
            @update-data="updatePrestaData"
          ></PrestaCard>
        </v-col>
      </v-row>
      <!--<v-row>
        <v-col>
          <h2>Logistique 🚚</h2>
          <h4>
            S'il manque des informations, ou du matos veuillez contacter le
            responsable de la logistique sur
            <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>
          </h4>
          <LogisticsCard
            title="Matos"
            :store="store"
          ></LogisticsCard>
        </v-col>
      </v-row>
      <v-row />
      <LogisticsCard
        title="Barrières"
        :store="store"
      ></LogisticsCard>
      <LogisticsCard
        title="Matos Elec / Eau"
        :store="store"
      ></LogisticsCard>-->
      <v-row>
        <v-col md="6">
          <ElecLogisticCard></ElecLogisticCard>
        </v-col>
        <v-col md="6">
          <WaterLogisticCard
            :data="waterLogisticData"
            @update-data="updateWaterLogisticData"
          ></WaterLogisticCard>
        </v-col>
      </v-row>
      <CommentCard :comments="commentArray"></CommentCard>
      <FTCard></FTCard>
      <v-btn @click="saveFA">Sauvegarder</v-btn>
    </v-container>
    </div>
</template>

<script>
import TimeframeTable from "~/components/organisms/form/fa/TimeframeTable.vue";
import { RepoFactory } from "../../repositories/repoFactory";
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import FTCard from "../../components/organisms/form/fa/FTCard";
import { safeCall } from "../../utils/api/calls";
import SignaCard from "~/components/organisms/form/fa/SignaCard.vue";
import ElecLogisticCard from "../../components/organisms/form/fa/ElecLogisticCard";
import PrestaCard from "~/components/organisms/form/fa/PrestaCard.vue";
import WaterLogisticCard from "~/components/organisms/form/fa/WaterLogisticCard.vue";
import FAGeneralCard from "~/components/organisms/form/fa/FAGeneralCard.vue";
import FADetailCard from "~/components/organisms/form/fa/FADetailCard.vue";
import SecurityCard from "~/components/organisms/form/fa/SecurityCard.vue";
import {
  EquipmentTypes,
  ElecTypes,
  BarrieresTypes,
} from "../../utils/models/FA";

export default {
  name: "Fa",
  components: {
    ElecLogisticCard,
    SignaCard,
    FTCard,
    CommentCard,
    LogisticsCard,
    TimeframeTable,
    PrestaCard,
    WaterLogisticCard,
    FAGeneralCard,
    FADetailCard,
    SecurityCard,
  },
  middleware: "user",

  data() {
    return {
      generalData: {},
      detailData: {},
      securityData: {},
      prestaData: {},
      waterLogisticData: {},
      commentArray: [],
    };
  },
  computed: {
    store: function () {
      return this.$accessor.FA;
    },
  },
  methods: {
    updateGeneralData(generalData) {
      this.generalData = generalData;
    },
    updateDetailData(detailData) {
      this.detailData = detailData;
    },
    updateSecurityData(securityData) {
      this.securityData = securityData;
    },
    updatePrestaData(prestaData) {
      this.prestaData = prestaData;
    },
    updateWaterLogisticData(waterLogisticData) {
      this.waterLogisticData = waterLogisticData;
    },
    
    saveFA() {
      console.log(this.generalData);
      console.log(this.detailData);
      console.log(this.securityData);
      console.log(this.prestaData);
      console.log(this.waterLogisticData);
    }
  },
};
</script>

<style scoped>

</style>
