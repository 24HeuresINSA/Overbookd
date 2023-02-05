<template>
  <div class="main fa">
    <div class="sidebar">
      <h1>Fiche Activité n°{{ faId }}</h1>
      <h2>{{ faName }}</h2>

      <div class="status">
        <span class="dot" :class="faValidationStatus"></span>
        <h3>
          {{
            mFA.status ? statusTrad.get(mFA.status.toUpperCase()) : "Brouillon"
          }}
        </h3>
      </div>

      <div class="icons">
        <div v-for="validator of validators" :key="validator.code" class="icon">
          <v-icon :class="validatorValidationStatus(validator)" size="26">
            {{ validator.icon }}
          </v-icon>
          <span class="icon-detail">{{ validator.name }}</span>
        </div>
      </div>
      <FestivalEventSummary class="summary" />
    </div>
    <v-container class="container fa">
      <FAGeneralCard id="general" />
      <FADetailCard id="detail" />
      <SignaCard id="signa" />
      <TimeframeTable id="timewindow" />
      <SecurityCard id="security" />
      <CollaboratorCard id="presta" />
      <h2 id="log" class="log-text">Logistique 🚚</h2>
      <h4 class="log-text">
        S'il manque des informations, ou du matos veuillez contacter le
        responsable de la logistique sur
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>.
      </h4>
      <LogisticTimeWindow />
      <FALogisticsCard
        title="Matos"
        owner="matos"
        :ponctual-usage-gear="false"
      />
      <FALogisticsCard
        title="Barrières"
        owner="barrieres"
        :ponctual-usage-gear="false"
      />
      <FALogisticsCard
        title="Matos Elec / Eau"
        owner="elec"
        :ponctual-usage-gear="false"
      />
      <ElecLogisticCard id="elec" />
      <WaterLogisticCard id="water" />
      <CommentCard id="comment" />
      <ChildFTCard id="ft" />
    </v-container>
    <FestivalEventBottomBar festival-event="FA" />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LogisticTimeWindow from "~/components/molecules/logistics/LogisticTimeWindow.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import ChildFTCard from "~/components/organisms/form/fa/ChildFTCard.vue";
import CollaboratorCard from "~/components/organisms/form/fa/CollaboratorCard.vue";
import ElecLogisticCard from "~/components/organisms/form/fa/ElecLogisticCard.vue";
import FADetailCard from "~/components/organisms/form/fa/FADetailCard.vue";
import FAGeneralCard from "~/components/organisms/form/fa/FAGeneralCard.vue";
import SecurityCard from "~/components/organisms/form/fa/SecurityCard.vue";
import SignaCard from "~/components/organisms/form/fa/SignaCard.vue";
import TimeframeTable from "~/components/organisms/form/fa/TimeframeTable.vue";
import WaterLogisticCard from "~/components/organisms/form/fa/WaterLogisticCard.vue";
import FestivalEventSummary from "~/components/organisms/form/FestivalEventSummary.vue";
import FALogisticsCard from "~/components/organisms/form/FALogisticsCard.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import { Team } from "~/utils/models/team";
import FestivalEventBottomBar from "~/components/organisms/form/FestivalEventBottomBar.vue";

export default Vue.extend({
  name: "Fa",
  components: {
    ElecLogisticCard,
    CommentCard,
    SignaCard,
    FALogisticsCard,
    TimeframeTable,
    CollaboratorCard,
    WaterLogisticCard,
    FAGeneralCard,
    FADetailCard,
    SecurityCard,
    FestivalEventSummary,
    SnackNotificationContainer,
    LogisticTimeWindow,
    ChildFTCard,
    FestivalEventBottomBar,
  },

  data: () => ({
    statusTrad: new Map<string, string>([
      ["DRAFT", "Brouillon"],
      ["SUBMITTED", "Soumise à validation"],
      ["REFUSED", "Refusée"],
      ["VALIDATED", "Validée"],
    ]),
  }),

  computed: {
    FA(): any {
      return this.$accessor.FA;
    },
    mFA(): any {
      return this.FA.mFA;
    },
    me(): any {
      return this.$accessor.user.me;
    },
    faId(): number {
      return +this.$route.params.fa;
    },
    faName(): string {
      return this.FA.mFA.name;
    },
    validators(): Team[] {
      return this.$accessor.team.faValidators;
    },
    faValidationStatus(): string {
      return this.mFA.status.toLowerCase();
    },
  },

  async mounted() {
    await this.$accessor.FA.getAndSet(this.faId);
    if (this.mFA.id !== this.faId) {
      alert("Oups 😬 J'ai l'impression que cette FA n'existe pas...");
      await this.$router.push({
        path: "/fa",
      });
    }

    let title = "FA " + this.faId;
    if (this.mFA.name) title += " - " + this.mFA.name;
    document.title = title;

    this.$accessor.signa.getAllSignaLocations();

    if (this.validators.length === 0) {
      await this.$accessor.team.fetchFaValidators();
    }
  },
  methods: {
    validatorValidationStatus(validator: Team) {
      return getFAValidationStatus(this.mFA, validator.code).toLowerCase();
    },

    isAnimationValidatedBy(validator: Team) {
      return isAnimationValidatedBy(this.mFA, validator.code);
    },
  },
});
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  height: calc(100vh - 124px);
  overflow-y: hidden;
}

.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  overflow: auto;
  padding-right: 20px;
  width: 300px;

  h1 {
    font-size: 1.7rem;
    margin: 16px;
    margin-bottom: 4px;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: normal;
    color: rgb(89, 89, 89);
    margin: 16px;
    margin-top: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: auto;
    display: block;
    overflow: hidden;
  }

  .status {
    display: flex;
    align-items: center;

    .dot {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 16px;
      margin-right: 10px;
    }
  }
}

.icons {
  display: flex;
  justify-content: space-between;
  margin: 20px 5px 15px 16px;

  .icon {
    position: relative;
    display: inline-block;

    .icon-detail {
      visibility: hidden;
      width: 60px;
      font-size: 0.9rem;
      text-align: center;
      border-radius: 6px;
      user-select: none;

      position: absolute;
      z-index: 1;
      top: 100%;
      left: 50%;
      margin-left: -30px;
    }
  }

  .icon:hover .icon-detail {
    visibility: visible;
  }
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
  scroll-behavior: smooth;
  padding-bottom: 50px;
  > * {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
}

.log-text {
  margin-bottom: 8px;
}

@media only screen and (max-width: 965px) {
  .container {
    padding-bottom: 200px;
  }
}

@media only screen and (max-width: 750px) {
  .main {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .summary {
    visibility: collapse;
  }

  .container {
    overflow: visible;
  }
}
</style>
