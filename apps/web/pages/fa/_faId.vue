<template>
  <div class="fa-content fa">
    <FestivalEventSidebar festival-event="FA" />
    <article class="container fa">
      <FaGeneralCard id="general" />
      <FaInChargeCard id="in-charge" />
      <SignaCard id="signa" />
      <SecurityCard id="security" />
      <!--<FaTimeWindowCard id="timewindow" />
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
      <ChildFtCard id="ft" />-->
    </article>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FestivalActivity } from "@overbookd/festival-activity";
import FestivalEventSidebar from "~/components/organisms/festival-event/FestivalEventSidebar.vue";
import FaGeneralCard from "~/components/organisms/festival-event/festival-activity/FaGeneralCard.vue";
import FaInChargeCard from "~/components/organisms/festival-event/festival-activity/FaInChargeCard.vue";
import SignaCard from "~/components/organisms/festival-event/festival-activity/SignaCard.vue";
import SecurityCard from "~/components/organisms/festival-event/festival-activity/SecurityCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default defineComponent({
  name: "Fa",
  components: {
    FaGeneralCard,
    FaInChargeCard,
    SignaCard,
    SecurityCard,
    FestivalEventSidebar,
    SnackNotificationContainer,
  },

  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    faId(): number {
      return +this.$route.params.faId;
    },
  },

  async mounted() {
    await this.$accessor.festivalActivity.fetchActivity(this.faId);
    if (this.mFA.id !== this.faId) {
      this.$accessor.notif.pushNotification({
        message: "Oups 😬 J'ai l'impression que cette FA n'existe pas...",
      });
      this.$router.push({ path: "/fa" });
    }
    document.title = `FA ${this.faId} - ${this.mFA.general.name}`;
  },
});
</script>

<style lang="scss" scoped>
.fa-content {
  display: flex;
  height: calc(100vh - 124px);
  overflow-y: hidden;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
  scroll-behavior: smooth;
  width: 100%;
  padding: 12px;
  margin-right: auto;
  margin-left: auto;
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

@media only screen and (max-width: $mobile-max-width) {
  .fa-content {
    flex-direction: column;
    overflow-y: scroll;
  }

  .container {
    overflow: visible;
  }
}
</style>
