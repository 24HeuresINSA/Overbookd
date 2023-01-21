<template>
  <div class="main">
    <FestivalEventSidebar festival-event="FT" />
    <v-container class="container ft">
      <FTGeneralCard id="general" />
      <ParentFACard id="fa" />
      <FTDetailCard id="detail" />
      <FTTimeWindowCard id="timewindow" />
      <LogisticsCard id="matos" title="Matos" />
      <FeedbackCard id="comment" form="FT" />
    </v-container>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import FeedbackCard from "~/components/organisms/form/FeedbackCard.vue";
import FestivalEventSidebar from "~/components/organisms/form/FestivalEventSidebar.vue";
import FTDetailCard from "~/components/organisms/form/ft/FTDetailCard.vue";
import FTGeneralCard from "~/components/organisms/form/ft/FTGeneralCard.vue";
import FTTimeWindowCard from "~/components/organisms/form/ft/FTTimeWindowCard.vue";
import ParentFACard from "~/components/organisms/form/ft/ParentFACard.vue";
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";

export default Vue.extend({
  name: "FT",
  components: {
    FestivalEventSidebar,
    FTGeneralCard,
    ParentFACard,
    FTDetailCard,
    FTTimeWindowCard,
    LogisticsCard,
    SnackNotificationContainer,
    FeedbackCard,
  },
  computed: {
    mFT() {
      return this.$accessor.FT.mFT;
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
    await this.$accessor.FT.fetchFT(this.ftId);
    if (this.mFT.id !== this.ftId) {
      alert("Oups 😬 J'ai l'impression que cette FT n'existe pas...");
      await this.$router.push({
        path: "/ft",
      });
    }
    document.title = this.title;
  },
  methods: {
    hasPermission(permission: string) {
      return this.$accessor.user.hasPermission(permission);
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

.bottom-bar {
  position: fixed;
  right: 5%;
  bottom: 42px;
  z-index: 3;
  display: flex;
  gap: 30px;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
  }
}

@media only screen and (max-width: 965px) {
  .bottom-bar {
    position: fixed;
    bottom: 42px;
    &__actions {
      flex-direction: column;
    }
  }
  .container {
    padding-bottom: 200px;
  }
}

@media only screen and (max-width: 750px) {
  .main {
    flex-direction: column;
  }
  .container {
    overflow: visible;
  }
}
</style>
