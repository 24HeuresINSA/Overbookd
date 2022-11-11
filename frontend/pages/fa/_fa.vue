<template>
  <div class="main">
    <div class="summary">
      <p @click="autoScroll('general')">Général</p>
      <p @click="autoScroll('signa')">Signa</p>
      <p @click="autoScroll('detail')">Détail</p>
      <p @click="autoScroll('timeframe')">Créneaux</p>
      <p @click="autoScroll('security')">Sécurité</p>
      <p @click="autoScroll('presta')">Presta</p>
      <p @click="autoScroll('elec')">Besoin Elec</p>
      <p @click="autoScroll('water')">Besoin Eau</p>
      <p @click="autoScroll('comment')">Commentaires</p>
      <p @click="autoScroll('ft')">FT</p>
    </div>
    <!-- Pour créer une div summary prise en compte dans le flex (car summary est fixed) -> à modifier -->
    <div class="summary-space"></div>
    <v-container class="container">
      <h1>Fiche Activité</h1>
      <FAGeneralCard
        id="general"
        :data="generalData"
        @update-data="updateGeneralData"
      ></FAGeneralCard>
      <SignaCard
        id="signa"
      ></SignaCard>
      <FADetailCard
        id="detail"
        :data="detailData"
        @update-data="updateDetailData"
      ></FADetailCard>
      <TimeframeTable
        id="timeframe"
        :store="store"
      ></TimeframeTable>
      <SecurityCard
        id="security"
        :data="securityData"
        @update-data="updateSecurityData"
      ></SecurityCard>
      <PrestaCard
        id="presta"
        :data="prestaData"
        @update-data="updatePrestaData"
      ></PrestaCard>
      <!--<h2>Logistique 🚚</h2>
      <h4>
        S'il manque des informations, ou du matos veuillez contacter le
        responsable de la logistique sur
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>
      </h4>
      <LogisticsCard
        title="Matos"
        :store="store"
      ></LogisticsCard>
      <LogisticsCard
        title="Barrières"
        :store="store"
      ></LogisticsCard>
      <LogisticsCard
        title="Matos Elec / Eau"
        :store="store"
      ></LogisticsCard>-->
      <ElecLogisticCard
        id="elec"
      ></ElecLogisticCard>
      <WaterLogisticCard
        id="water"
        :data="waterLogisticData"
        @update-data="updateWaterLogisticData"
      ></WaterLogisticCard>
      <CommentCard
        id="comment"
        :comments="commentArray"
      ></CommentCard>
      <FTCard
        id="ft"
      ></FTCard>
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
    },

    autoScroll(id) {
      document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    }
  },
};
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
    top: 30%;
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
