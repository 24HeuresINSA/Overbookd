<template>
  <div>
    <div class="main">
      <h1>Fiche Activité</h1>
    </div>
    <br />
    <v-container class="container">
      <v-row>
        <v-col md="6">
          <FAGeneralCard
            v-model="generalData"
          ></FAGeneralCard>
        </v-col>
        <v-col md="6">
          <OverSigna></OverSigna>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <FADetailCard v-model="detailData"></FADetailCard>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <TimeframeTable :store="store"></TimeframeTable>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="6">
          <v-card>
            <v-card-title>Sécurité</v-card-title>
            <v-card-subtitle>Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu de ton activité, contacte securite@24heures.org</v-card-subtitle>
            <v-card-text>
              <v-form>
                <v-textarea
                  v-model="formData.securityDevice"
                  label="Dispositif de sécurité particulier"
                  required
                ></v-textarea>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="6">
          <PrestaCard 
            v-model="prestaData"
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
      <br />
      <LogisticsCard
        title="Barrières"
        :store="store"
      ></LogisticsCard>
      <br />
      <LogisticsCard
        title="Matos Elec / Eau"
        :store="store"
      ></LogisticsCard>
      <br />-->
      <v-row>
        <v-col md="6">
          <ElecLogisticCard></ElecLogisticCard>
        </v-col>
        <v-col md="6">
          <WaterLogisticCard
            v-model="waterLogisticData"
          ></WaterLogisticCard>
        </v-col>
      </v-row>
      <br />
      <!--<CommentCard :comments="commentData"></CommentCard>
      <br />-->
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
import PassSecuCard from "../../components/organisms/form/fa/PassSecuCard";
import OverSigna from "../../components/organisms/form/fa/OverSigna";
import ElecLogisticCard from "../../components/organisms/form/fa/ElecLogisticCard";
import PrestaCard from "~/components/organisms/form/fa/PrestaCard.vue";
import WaterLogisticCard from "~/components/organisms/form/fa/WaterLogisticCard.vue";
import FAGeneralCard from "~/components/organisms/form/fa/FAGeneralCard.vue";
import FADetailCard from "~/components/organisms/form/fa/FADetailCard.vue";
import {
  EquipmentTypes,
  ElecTypes,
  BarrieresTypes,
} from "../../utils/models/FA";

export default {
  name: "Fa",
  components: {
    ElecLogisticCard,
    OverSigna,
    PassSecuCard,
    FTCard,
    CommentCard,
    LogisticsCard,
    TimeframeTable,
    PrestaCard,
    WaterLogisticCard,
    FAGeneralCard,
    FADetailCard,
  },
  middleware: "user",

  data() {
    return {
      formData: {},
      generalData: {},
      detailData: {},
      prestaData: {},
      waterLogisticData: {},
      commentData: {},
    };
  },
  computed: {
    store: function () {
      return this.$accessor.FA;
    },
  },
  methods: {
    saveFA() {
      console.log("test");
    }
  },
};
</script>

<style scoped>

</style>
