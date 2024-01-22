<template>
  <div class="ft-content ft">
    <FestivalEventSidebar festival-event="FT" class="sidebar" />
    <v-container class="container ft">
      <FtGeneralCard id="general" />
    </v-container>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import FestivalEventSidebar from "~/components/organisms/festival-event/FestivalEventSidebar.vue";
import { FestivalTask } from "@overbookd/festival-event";
import FtGeneralCard from "~/components/organisms/festival-event/festival-task/FtGeneralCard.vue";

export default defineComponent({
  name: "Ft",
  components: {
    FestivalEventSidebar,
    SnackNotificationContainer,
    FtGeneralCard,
  },
  computed: {
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    ftId(): number {
      return +this.$route.params.ftId;
    },
  },
  async mounted() {
    await this.$accessor.festivalTask.fetchTask(this.ftId);
    if (this.selectedTask.id !== this.ftId) {
      this.$accessor.notif.pushNotification({
        message: "Oups 😬 J'ai l'impression que cette FT n'existe pas...",
      });
      this.$router.push({ path: "/ft" });
    }
    document.title = `FT ${this.ftId} - ${this.selectedTask.general.name}`;
  },
});
</script>

<style lang="scss" scoped>
$sidebar-width: 350px;

.ft-content {
  display: flex;
  height: calc(100vh - #{$header-height} - #{$footer-height});
  overflow: auto;
  scroll-behavior: smooth;
}

.sidebar {
  position: fixed;
  width: $sidebar-width;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: calc(100vw - #{$sidebar-width} - 90px);
  padding: 12px;
  margin-left: $sidebar-width;
  gap: 20px;
}

@media only screen and (max-width: $mobile-max-width) {
  .ft-content {
    flex-direction: column;
    overflow-y: scroll;
    height: auto;
  }

  .sidebar {
    position: relative;
    width: 100%;
    margin: unset;
    margin-bottom: 20px;
  }

  .container {
    overflow: visible;
    margin: unset;
    padding: unset;
  }
}
</style>
