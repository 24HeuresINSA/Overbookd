<template>
  <div class="logistic">
    <h1>Logistique</h1>
    <GearRequestListing />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GearRequestListing from "~/components/organisms/logistic/GearRequestListing.vue";

export default Vue.extend({
  name: "Logistic",
  components: { GearRequestListing },
});
</script>
