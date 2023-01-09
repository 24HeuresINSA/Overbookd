<template>
  <div class="main">
    <FormSidebar form="FT" />
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
import FormSidebar from "~/components/organisms/form/FormSidebar.vue";
import FTDetailCard from "~/components/organisms/form/ft/FTDetailCard.vue";
import FTGeneralCard from "~/components/organisms/form/ft/FTGeneralCard.vue";
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";
import ParentFACard from "~/components/organisms/form/ft/ParentFACard.vue";

export default Vue.extend({
  name: "FT",
  components: {
    FormSidebar,
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
