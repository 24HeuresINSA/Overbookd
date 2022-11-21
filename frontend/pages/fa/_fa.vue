<template>
  <div class="main">
    <FormSidebar class="summary"></FormSidebar>
    <!-- Pour créer une div summary prise en compte dans le flex (car summary est fixed) -> à modifier -->
    <div class="summary-space"></div>
    <v-container class="container">
      <h1>Fiche Activité</h1>
      <FAGeneralCard id="general"></FAGeneralCard>
      <FADetailCard id="detail"></FADetailCard>
      <!-- <SignaCard id="signa"></SignaCard> -->
      <TimeframeTable
        id="timeframe"
        :store="store"
      ></TimeframeTable>
      <SecurityCard id="security"></SecurityCard>
      <PrestaCard id="presta"></PrestaCard>
      <!--<h2>Logistique 🚚</h2>
      <h4>
        S'il manque des informations, ou du matos veuillez contacter le
        responsable de la logistique sur
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>
      </h4>
      <LogisticsCard
        title="Matos"
        :types="Object.values(EquipmentTypes)"
      ></LogisticsCard>
      <LogisticsCard
        title="Barrières"
        :types="Object.values(BarrieresTypes)"
      ></LogisticsCard>
      <LogisticsCard
        title="Matos Elec / Eau"
        :types="Object.values(ElecTypes)"
      ></LogisticsCard>-->
      <ElecLogisticCard id="elec"></ElecLogisticCard>
      <WaterLogisticCard id="water"></WaterLogisticCard>
      <CommentCard
        id="comment"
      ></CommentCard>
      <FTCard id="ft"></FTCard>
      <v-btn @click="saveFA">Sauvegarder</v-btn>
    </v-container>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeframeTable from "~/components/organisms/form/fa/TimeframeTable.vue";
import { RepoFactory } from "~/repositories/repoFactory"
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import FTCard from "~/components/organisms/form/fa/FTCard.vue";
import { safeCall } from "../../utils/api/calls";
import SignaCard from "~/components/organisms/form/fa/SignaCard.vue";
import ElecLogisticCard from "~/components/organisms/form/fa/ElecLogisticCard.vue";
import PrestaCard from "~/components/organisms/form/fa/PrestaCard.vue";
import WaterLogisticCard from "~/components/organisms/form/fa/WaterLogisticCard.vue";
import FAGeneralCard from "~/components/organisms/form/fa/FAGeneralCard.vue";
import FADetailCard from "~/components/organisms/form/fa/FADetailCard.vue";
import SecurityCard from "~/components/organisms/form/fa/SecurityCard.vue";
import FormSidebar from "~/components/organisms/form/FormSidebar.vue";
import {
  EquipmentTypes,
  ElecTypes,
  BarrieresTypes,
} from "../../utils/models/FA";

export default Vue.extend({
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
    FormSidebar,
  },

  data() {
    return {
      EquipmentTypes,
      ElecTypes,
      BarrieresTypes,
    };
  },

  computed: {
    store(): any {
      return this.$accessor.FA;
    },
    FA(): any {
      console.log(this.$accessor.FA.mFA);
      return this.$accessor.FA.mFA;
    },
  },
  
  methods: {
    async saveFA() {
      console.log(this.FA);
      await RepoFactory.faRepo.updateFA(this, this.FA);
    },
  },
});
</script>

<style scoped>
* {
  scroll-margin-top: 80px;
}

.main {
  display: flex;
}

.summary {
  position: fixed;
  top: 20%;
}

.summary-space {
  width: 120px;
}

.container {
  display: flex;
  flex-direction: column;
}

.container > * {
  margin-bottom: 30px;
}
</style>
