<template>
  <div>
    <h1>A l'aide</h1>
    <p>Trouve un bénévole pour venir te donner un coup de main</p>
    <div class="need-help">
      <NeedHelpFormCard class="need" />
      <NeedHelpVolunteerList class="volunteers mobile" />
      <CalendarList class="volunteers desktop" />
    </div>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CalendarList from "~/components/molecules/need-help/CalendarList.vue";
import NeedHelpFormCard from "~/components/molecules/need-help/NeedHelpFormCard.vue";
import NeedHelpVolunteerList from "~/components/molecules/need-help/NeedHelpVolunteerList.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default defineComponent({
  name: "NeedHelp",
  components: {
    NeedHelpFormCard,
    NeedHelpVolunteerList,
    CalendarList,
    SnackNotificationContainer,
  },
  head: () => ({
    title: "A l'aide !",
  }),
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
