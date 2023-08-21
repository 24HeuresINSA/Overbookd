<template>
  <div>
    <h1>A l'aide</h1>
    <p>Trouve un bénévole pour venir te donner un coup de main</p>
    <div class="need-help">
      <NeedHelpFormCard class="need" />
      <NeedHelpVolunteerList class="volunteers mobile" />
      <CalendarList class="volunteers desktop" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CalendarList from '~/components/molecules/need-help/CalendarList.vue';
import NeedHelpFormCard from '~/components/molecules/need-help/NeedHelpFormCard.vue';
import NeedHelpVolunteerList from '~/components/molecules/need-help/NeedHelpVolunteerList.vue';

export default Vue.extend({
  name: 'NeedHelp',
  components: { NeedHelpFormCard, NeedHelpVolunteerList, CalendarList },
});
</script>

<style lang="scss" scoped>
.need-help {
  margin-top: 10px;
  display: flex;
  gap: 20px;
  .mobile {
    display: none;
  }
  @media (width <= 900px) {
    flex-direction: column;
    .desktop {
      display: none;
    }
    .mobile {
      display: unset;
    }
  }
  .need {
    flex-grow: 1;
  }
  .volunteers {
    flex-grow: 4;
  }
}
</style>
