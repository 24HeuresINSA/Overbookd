<template>
  <div class="layout">
    <Header />
    <div class="side-with-main">
      <SideNav />
      <div class="main">
        <div class="content">
          <slot />
        </div>
        <Footer />
      </div>
    </div>

    <v-dialog
      v-model="shouldApproveEULA"
      transition="dialog-bottom-transition"
      max-width="600"
      persistent
    >
      <ApproveEULADialogCard />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import Header from "~/layouts/parts/header.vue";
import SideNav from "~/layouts/parts/side-nav.vue";
import Footer from "~/layouts/parts/footer.vue";

const userStore = useUserStore();
const teamStore = useTeamStore();
const configurationStore = useConfigurationStore();

const loggedUser = computed(() => userStore.loggedUser);
const shouldApproveEULA = computed<boolean>(() => {
  return loggedUser.value?.hasApprovedEULA === false;
});

onBeforeMount(async () => {
  await userStore.fetchMyInformation();
  teamStore.fetchTeams();
  configurationStore.fetch("eventDate");
});
</script>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.side-with-main {
  flex: 1;
  display: flex;
  min-height: calc(100% - #{$header-height});
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
  .main {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-left: 35px;
    width: 100%;
    @media only screen and (max-width: $mobile-max-width) {
      padding-bottom: 60px;
      margin: unset;
    }
    .content {
      padding: 10px;
      @media only screen and (max-width: $mobile-max-width) {
        padding: 0 5px 5px 5px;
      }
    }
  }
}
</style>
