<template>
  <div class="main fa">
    <FestivalEventSidebar festival-event="FA" />
    <v-container class="container fa">
      <FaGeneralCard id="general" />
      <FaDetailCard id="detail" />
      <SignaCard id="signa" />
      <FaTimeWindowCard id="timewindow" />
      <SecurityCard id="security" />
      <CollaboratorCard id="presta" />
      <h2 id="log" class="log-text">Logistique 🚚</h2>
      <h4 class="log-text">
        S'il manque des informations, ou du matos veuillez contacter le
        responsable de la logistique sur
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>.
      </h4>
      <LogisticTimeWindow />
      <FaLogisticsCard
        title="Matos"
        owner="matos"
        :ponctual-usage-gear="false"
      />
      <FaLogisticsCard
        title="Barrières"
        owner="barrieres"
        :ponctual-usage-gear="false"
      />
      <FaLogisticsCard
        title="Matos Elec / Eau"
        owner="elec"
        :ponctual-usage-gear="false"
      />
      <ElectricityNeedCard id="elec" />
      <WaterLogisticCard id="water" />
      <FeedbackCard id="feedback" />
      <ChildFtCard id="ft" />
    </v-container>
    <FestivalEventBottomBar festival-event="FA" />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import LogisticTimeWindow from '~/components/molecules/festival-event/logistic/LogisticTimeWindow.vue';
import SnackNotificationContainer from '~/components/molecules/snack/SnackNotificationContainer.vue';
import FeedbackCard from '~/components/organisms/festival-event/FeedbackCard.vue';
import FestivalEventBottomBar from '~/components/organisms/festival-event/FestivalEventBottomBar.vue';
import ChildFtCard from '~/components/organisms/festival-event/fa/ChildFtCard.vue';
import CollaboratorCard from '~/components/organisms/festival-event/fa/CollaboratorCard.vue';
import FaDetailCard from '~/components/organisms/festival-event/fa/FaDetailCard.vue';
import FaGeneralCard from '~/components/organisms/festival-event/fa/FaGeneralCard.vue';
import FaLogisticsCard from '~/components/organisms/festival-event/fa/FaLogisticsCard.vue';
import FaTimeWindowCard from '~/components/organisms/festival-event/fa/FaTimeWindowCard.vue';
import SecurityCard from '~/components/organisms/festival-event/fa/SecurityCard.vue';
import SignaCard from '~/components/organisms/festival-event/fa/SignaCard.vue';
import WaterLogisticCard from '~/components/organisms/festival-event/fa/WaterLogisticCard.vue';
import FestivalEventSidebar from '~/components/organisms/festival-event/FestivalEventSidebar.vue';
import { Fa } from '~/utils/models/fa';
import ElectricityNeedCard from '~/components/organisms/festival-event/fa/ElectricityNeedCard.vue';

export default Vue.extend({
  name: 'Fa',
  components: {
    SignaCard,
    FaLogisticsCard,
    FaTimeWindowCard,
    CollaboratorCard,
    WaterLogisticCard,
    FaGeneralCard,
    FaDetailCard,
    SecurityCard,
    FestivalEventSidebar,
    SnackNotificationContainer,
    LogisticTimeWindow,
    ChildFtCard,
    FestivalEventBottomBar,
    FeedbackCard,
    ElectricityNeedCard,
  },

  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    faId(): number {
      return +this.$route.params.fa;
    },
  },

  async mounted() {
    await this.$accessor.fa.fetchFa(this.faId);
    if (this.mFA.id !== this.faId) {
      alert("Oups 😬 J'ai l'impression que cette FA n'existe pas...");
      await this.$router.push({
        path: '/fa',
      });
    }

    let title = 'FA ' + this.faId;
    if (this.mFA.name) title += ' - ' + this.mFA.name;
    document.title = title;

    this.$accessor.signa.getAllSignaLocations();
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

  #status {
    display: flex;
    align-items: center;

    #dot {
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
    overflow-y: scroll;
  }

  .sidebar {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .summary {
    display: none;
  }

  .container {
    overflow: visible;
  }
}
</style>
