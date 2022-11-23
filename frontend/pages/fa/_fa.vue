<template>
  <div class="main">
    <div class="sidebar">
      <h1>Fiche Activité n°{{ faId }}</h1>

      <div class="status">
        <span
          class="dot"
          :class="
            mFA.status == 'SUBMITTED'
              ? 'purple'
              : mFA.status == 'REFUSED'
              ? 'red'
              : mFA.status == 'VALIDATED'
              ? 'green'
              : 'orange'
          "
        ></span>
        <h3>{{ mFA.status ? statusTrad.get(mFA.status.toUpperCase()) : "Brouillon" }}</h3>
      </div>

      <div class="icons">
        <div
          v-for="(validator, i) of validators"
          :key="i"
          :color="getIconColor(validator)"
          class="icon"
        >
          <v-icon :key="i" size="26">
            {{ getValidatorIcon(validator) }}
          </v-icon>
          <span class="icon-detail">{{ validator }}</span>
        </div>
      </div>
      <FormSidebar></FormSidebar>
    </div>
    <v-container class="container">
      <FAGeneralCard id="general"></FAGeneralCard>
      <FADetailCard id="detail"></FADetailCard>
      <SignaCard id="signa"></SignaCard>
      <TimeframeTable id="timeframe" :store="FA" ></TimeframeTable>
      <SecurityCard id="security"></SecurityCard>
      <PrestaCard id="presta"></PrestaCard>
      <h2>Logistique 🚚</h2>
      <h4>
        S'il manque des informations, ou du matos veuillez contacter le
        responsable de la logistique sur
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>
      </h4>
      <LogisticsCard
        title="Matos"
        :types="Object.values({})"
        :store="FA"
      ></LogisticsCard>

      <LogisticsCard
        title="Barrières"
        :types="Object.values({})"
        :store="FA"
      ></LogisticsCard>
      <LogisticsCard
        title="Matos Elec / Eau"
        :types="Object.values({})"
        :store="FA"
      ></LogisticsCard>
      <ElecLogisticCard id="elec"></ElecLogisticCard>
      <WaterLogisticCard id="water"></WaterLogisticCard>
      <CommentCard id="comment"></CommentCard>
      <!-- <FTCard id="ft"></FTCard> -->
    </v-container>

    <div class="bottom-bar">
      <div>
        <v-btn v-if="mFA.id > 1" small fab :href="`/fa/${mFA.id - 1}`">
          <v-icon small>mdi-arrow-left</v-icon>
        </v-btn>

        <v-btn
          v-if="mValidators.length === 1"
          color="red"
          @click="refuseDialog = true"
          >refusé par {{ mValidators[0] }}
        </v-btn>
        <v-menu v-if="mValidators.length > 1" offset-y>
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
            <v-list-item v-for="validator of mValidators" :key="validator" link>
              <v-list-item-title
                @click="refuseDialog = true"
                v-text="validator"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div>
        <template v-if="mValidators.length === 1">
          <v-btn color="green" @click="validate(mValidators[0])"
            >validé par {{ mValidators[0] }}
          </v-btn>
        </template>
        <v-menu v-if="mValidators.length > 1" offset-y>
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
            <v-list-item v-for="validator of mValidators" :key="validator" link>
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
        v-if="mFA.status && mFA.status !== 'SUBMITTED'"
        color="warning"
        @click="validationDialog = true"
        >soumettre à validation
      </v-btn>
      <v-btn @click="saveFA">sauvegarder</v-btn>
      <v-btn
        v-if="mValidators.length >= 1 && mFA.isValid === false"
        color="red"
        @click="undelete"
        >récupérer
      </v-btn>
      <v-btn small fab :href="`/fa/${mFA.id + 1}`">
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
          <v-btn color="primary" text @click="submit">
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
import { RepoFactory } from "~/repositories/repoFactory";
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import { safeCall } from "../../utils/api/calls";
import ElecLogisticCard from "~/components/organisms/form/fa/ElecLogisticCard.vue";
import PrestaCard from "~/components/organisms/form/fa/PrestaCard.vue";
import WaterLogisticCard from "~/components/organisms/form/fa/WaterLogisticCard.vue";
import FAGeneralCard from "~/components/organisms/form/fa/FAGeneralCard.vue";
import FADetailCard from "~/components/organisms/form/fa/FADetailCard.vue";
import SecurityCard from "~/components/organisms/form/fa/SecurityCard.vue";
import FormSidebar from "~/components/organisms/form/FormSidebar.vue";
import SignaCard from "~/components/organisms/form/fa/SignaCard.vue";

export default Vue.extend({
  name: "Fa",
  components: {
    ElecLogisticCard,
    CommentCard,
    SignaCard,
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
      faId: this.$route.params.fa,

      statusTrad: new Map<string, string>([
        ["DRAFT", "Brouillon"],
        ["SUBMITTED", "Soumise"],
        ["REFUSED", "Réfusée"],
        ["VALIDATED", "Validée"],
      ]),
      color: {
        submitted: "grey",
        validated: "green",
        refused: "red",
      },
    };
  },

  computed: {
    FA(): any {
      return this.$accessor.FA;
    },
    mFA(): any {
      return this.$accessor.FA.mFA;
    },
    me(): any {
      return this.$accessor.user.me;
    },
    teams(): any {
      return this.$accessor.config.getConfig("teams"); // à modifier
    },
    validators(): Array<string> {
      return this.$accessor.config.getConfig("fa_validators"); // à modifier
    },
    mValidators(): Array<string> {
      let mValidator: Array<string> = [];
      if (this.me.team.includes("admin")) {
        // admin has all the validators powers
        return this.validators;
      }
      if (this.validators) {
        this.validators.forEach((validator: string) => {
          if (this.me.team && this.me.team.includes(validator)) {
            mValidator.push(validator);
          }
        });
        return mValidator;
      }
      return [];
    },
  },

  async mounted() {
    console.log(this.mFA.status)
    let title = "FA " + this.faId;
    if (this.mFA.name) title += " : " + this.mFA.name;
    document.title = title;
  },
  
  methods: {
    async saveFA() {
      await RepoFactory.faRepo.updateFA(this, this.mFA);
    },

    async undelete() {
      await this.mFA.undelete();
      let context: any = this;
      await safeCall(
        context,
        this.faRepo.updateFA(this, this.mFA)
        // "undelete"
      );
    },

    validate(validator: any) {
      if (validator) {
        this.mFA.validate(validator);
        this.saveFA();
      }
    },

    submit() {
      this.mFA.submitForReview(this.me.lastname);
      this.validationDialog = false;
      this.saveFA();
    },

    getIconColor(validator: any) {
      if (this.FA.validated) {
        if (this.FA.validated.find((v: any) => v === validator)) {
          return this.color.validated;
        }
      }
      if (this.FA.refused) {
        if (this.FA.refused.find((v: any) => v === validator)) {
          return this.color.refused;
        }
      }
      if (this.FA.status === "submitted") {
        return this.color.submitted;
      }
    },

    getValidatorIcon(validator: any) {
      try {
        return this.teams.find((team: any) => team.name === validator).icon;
      } catch (e) {
        console.log(`can't find icon of team ${validator}`);
      }
    },
  },
});
</script>

<style scoped>
.main {
  display: flex;
  height: calc(100vh - 155px);
}

.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  overflow: auto;
  padding-right: 20px;
  width: 300px;
}

h1 {
  font-size: 30px;
  margin: 16px;
}

.dot {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-left: 16px;
  margin-right: 10px;
}

.status {
  display: flex;
  align-items: center;
}

.icons {
  display: flex;
  justify-content: space-between;
  margin: 20px 5px 15px 16px;
}

.icons .icon {
  position: relative;
  display: inline-block;
}

.icons .icon .icon-detail {
  visibility: hidden;
  width: 60px;
  color: #666666;
  font-size: 15px;
  text-align: center;
  border-radius: 6px;
  user-select: none;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  margin-left: -30px;
}

.icon:hover .icon-detail {
  visibility: visible;
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
  margin: 0 10vw 2px 10vw;
  display: flex;
  justify-content: space-between;
  z-index: 30;
  align-items: baseline;
  background-color: transparent;
}

.purple {
  background-color: purple;
}
.orange {
  background-color: orange;
}

.red {
  background-color: red;
}

.green {
  background-color: greenyellow;
}
</style>
