<template>
  <DesktopPageTitle />
  <div class="home">
    <ProfileHomeCard />
    <PersonalAccountHomeCard />
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  gap: $card-gap;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}
</style>
