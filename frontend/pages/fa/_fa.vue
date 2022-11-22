<template>
  <div class="main">
    <FormSidebar class="summary"></FormSidebar>  
    <v-container class="container">
      <h1>Fiche Activité n° {{ FA.id }}</h1>
      <FAGeneralCard id="general"></FAGeneralCard>
      <FADetailCard id="detail"></FADetailCard>
      <!-- <SignaCard id="signa"></SignaCard> -->
      <TimeframeTable id="timeframe" :store="store" ></TimeframeTable>
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
      <CommentCard id="comment"></CommentCard>
      <FTCard id="ft"></FTCard>  
    </v-container>

    <div class="bottom-bar">
      <div>
        <v-btn v-if="FA.id > 1" small fab :href="`/fa/${FA.id - 1}`">
          <v-icon small>mdi-arrow-left</v-icon>
        </v-btn>

        <v-btn
          v-if="validators.length === 1"
          color="red"
          @click="
            refuseDialog = true;
          "
          >refusé par {{ validators[0] }}
        </v-btn>
        <v-menu v-if="validators.length > 1" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn
              class="white--text ma-5"
              v-bind="attrs"
              color="red"
              v-on="on"
            >
              Refuser
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="validator of validators" :key="validator" link>
              <v-list-item-title
                @click="refuseDialog = true"
                v-text="validator"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div>
        <template v-if="validators.length === 1">
          <v-btn color="green" @click="validate(validators[0])"
            >validé par {{ validators[0] }}
          </v-btn>
        </template>
        <v-menu v-if="validators.length > 1" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn
              class="white--text ma-5"
              v-bind="attrs"
              color="green"
              v-on="on"
            >
              valider
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="validator of validators" :key="validator" link>
              <v-list-item-title
                color="green"
                @click="validate(validator)"
                v-text="validator"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <v-btn
        v-if="FA.status && FA.status !== 'submitted'"
        color="warning"
        @click="validationDialog = true"
        >soumettre à validation
      </v-btn>
      <v-btn @click="saveFA">sauvegarder</v-btn>
      <v-btn
        v-if="validators.length >= 1 && FA.isValid === false"
        color="red"
        @click="undelete"
        >récupérer
      </v-btn>
      <v-btn small fab :href="`/fa/${FA.id + 1}`">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="validationDialog" width="500">
      <v-card>
        <v-img
          height="620"
          src="https://media.discordapp.net/attachments/726537148119122023/806793684598128640/WhatsApp_Image_2021-02-03_at_23.36.35.jpeg"
        ></v-img>
        <v-card-title> ⚠️ Warning ⚠️ </v-card-title>
        <v-card-text> T'es sur de ta merde la ? </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="submitForReview">
            soumettre
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      validationDialog: false,
      refuseDialog: false,

      faRepo: RepoFactory.faRepo,

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
      return this.$accessor.FA.mFA;
    },
    me(): any {
      return this.$accessor.user.me;
    },
    validators(): Array<string> {
      let mValidator: Array<string> = [];
      const validators = this.$accessor.config.getConfig("fa_validators");
      if (this.me.team.includes("admin")) {
        // admin has all the validators powers
        return validators;
      }
      if (validators) {
        validators.forEach((validator: string) => {
          if (this.me.team && this.me.team.includes(validator)) {
            mValidator.push(validator);
          }
        });
        return mValidator;
      }
      return [];
    },
  },
  
  methods: {
    async saveFA() {
      console.log(this.FA);
      await RepoFactory.faRepo.updateFA(this, this.FA);
    },

    async undelete() {
      await this.FA.undelete();
      let context: any = this; 
      await safeCall(
        context,
        this.faRepo.updateFA(this, this.FA.mFA),
        // "undelete"
      );
    },

    validate(validator: any) {
      if (validator) {
        this.FA.validate(validator);
        this.saveFA();
      }
    },

    submitForReview() {
      this.FA.setStatus({
        status: "submitted",
        by: this.me.lastname,
      });
      this.validationDialog = false;
      this.saveFA();
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
  height: calc(100vh - 155px);
}

.summary {
  flex: 0 0 auto;
  overflow: auto;
  
}

.container {
  flex: 1 1 auto;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.container > * {
  margin-bottom: 30px;
}

.bottom-bar {
  position: fixed;
  bottom: 20px;
  width: 80vw;
  margin: 0 10vw;
  display: flex;
  justify-content: space-between;
  z-index: 30;
  align-items: baseline;
  background-color: transparent;
}
</style>
