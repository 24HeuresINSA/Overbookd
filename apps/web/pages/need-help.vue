<template>
  <DesktopPageTitle />
  <div class="need-help">
    <NeedHelpFilterCards class="filters" />
    <NeedHelpVolunteerListCard class="volunteer-list" />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Besoin d'aide" });
</script>

<style lang="scss" scoped>
.need-help {
  display: flex;
  gap: $card-gap;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}

.filters {
  width: 25%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}

.volunteer-list {
  width: 75%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}
</style>
