<template>
  <div>
    <h1>A l'aide</h1>
    <p>Trouve un bénévole pour venir te donner un coup de main</p>
    <div class="need-help">
      <NeedHelpFormCard class="need" />
      <VolunteerList class="volunteers" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import NeedHelpFormCard from "~/components/molecules/need-help/NeedHelpFormCard.vue";
import VolunteerList from "~/components/molecules/need-help/VolunteerList.vue";

export default Vue.extend({
  name: "NeedHelp",
  components: { NeedHelpFormCard, VolunteerList },
});
</script>

<style lang="scss" scoped>
.need-help {
  margin-top: 10px;
  display: flex;
  gap: 20px;
  @media (width <= 900px) {
    flex-direction: column;
  }
  .need {
    flex-grow: 1;
  }
  .volunteers {
    flex-grow: 4;
  }
}
</style>
