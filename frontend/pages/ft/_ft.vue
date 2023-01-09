<template>
  <div class="main">
    <div class="sidebar">
      <h1>Fiche Tâches n°{{ ftId }}</h1>
      <h2>Nom FT</h2>
      <div class="status">
        <span class="dot grey"></span>
        <h3>Status</h3>
      </div>
      <div class="icons">
        <div class="icon">
          <v-icon color="grey" size="26"> mdi-account </v-icon>
          <span class="icon-detail">Nom</span>
        </div>
      </div>
      <FormSummary class="summary" form="FT"></FormSummary>
    </div>
    <v-container class="container ft">
      <FTGeneralCard id="general" />
      <ParentFACard id="fa" />
      <FTDetailCard id="detail" />
      <LogisticsCard id="matos" title="Matos" />
      <CommentCard id="comment" form="FT" />
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import FormSummary from "~/components/organisms/form/FormSummary.vue";
import FTDetailCard from "~/components/organisms/form/ft/FTDetailCard.vue";
import FTGeneralCard from "~/components/organisms/form/ft/FTGeneralCard.vue";
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";
import ParentFACard from "~/components/organisms/form/ft/ParentFACard.vue";

export default Vue.extend({
  name: "FT",
  components: {
    FormSummary,
    FTGeneralCard,
    ParentFACard,
    FTDetailCard,
    LogisticsCard,
    CommentCard,
  },
  computed: {
    ftId(): number {
      return +this.$route.params.ft;
    },
  },
  async mounted() {
    this.$accessor.FT.fetchFT(this.ftId);
    this.$accessor.signa.getAllSignaLocations();
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
      background-color: #bbb;
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
}

.icon:hover .icon-detail {
  visibility: visible;
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
