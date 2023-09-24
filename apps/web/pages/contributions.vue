<template>
  <div>
    <h1>Cotisations</h1>
    <ContributionsTable />

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContributionsTable from "~/components/organisms/contribution/ContributionsTable.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default Vue.extend({
  name: "Contributions",
  components: { ContributionsTable, SnackNotificationContainer },
});
</script>
