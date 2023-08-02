<template>
  <div class="main">
    <FestivalEventSidebar festival-event="FT" />
    <v-container class="container ft">
      <FtGeneralCard id="general" />
      <ParentFaCard id="fa" />
      <FtDetailCard id="detail" />
      <FtTimeWindowCard id="timewindow" />
      <FtLogisticsCard id="matos" title="Matos" />
      <FeedbackCard id="feedback" form="FT" />
    </v-container>
    <FestivalEventBottomBar festival-event="FT" />
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import FeedbackCard from "~/components/organisms/festivalEvent/FeedbackCard.vue";
import FestivalEventBottomBar from "~/components/organisms/festivalEvent/FestivalEventBottomBar.vue";
import FestivalEventSidebar from "~/components/organisms/festivalEvent/FestivalEventSidebar.vue";
import FtDetailCard from "~/components/organisms/festivalEvent/ft/FtDetailCard.vue";
import FtGeneralCard from "~/components/organisms/festivalEvent/ft/FtGeneralCard.vue";
import FtLogisticsCard from "~/components/organisms/festivalEvent/ft/FtLogisticsCard.vue";
import FtTimeWindowCard from "~/components/organisms/festivalEvent/ft/FtTimeWindowCard.vue";
import ParentFaCard from "~/components/organisms/festivalEvent/ft/ParentFaCard.vue";

export default Vue.extend({
  name: "FT",
  components: {
    FestivalEventSidebar,
    FtGeneralCard,
    ParentFaCard,
    FtDetailCard,
    FtTimeWindowCard,
    FtLogisticsCard,
    SnackNotificationContainer,
    FeedbackCard,
    FestivalEventBottomBar,
  },
  computed: {
    mFT() {
      return this.$accessor.ft.mFT;
    },
    ftId(): number {
      return +this.$route.params.ft;
    },
    title(): string {
      const baseTitle = `FT ${this.ftId}`;
      if (!this.mFT.name) return baseTitle;
      return `${baseTitle} - ${this.mFT.name}`;
    },
  },
  async mounted() {
    await this.$accessor.ft.fetchFT(this.ftId);

    if (this.mFT.id !== this.ftId) {
      alert("Oups 😬 J'ai l'impression que cette FT n'existe pas...");
      return this.$router.push({
        path: "/ft",
      });
    }

    this.retrieveValidatorsIfNeeded();
    document.title = this.title;
  },
  methods: {
    async retrieveValidatorsIfNeeded() {
      if (this.$accessor.team.ftValidators.length) return;
      return this.$accessor.team.fetchFtValidators();
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
  .container {
    overflow: visible;
  }
}
</style>
