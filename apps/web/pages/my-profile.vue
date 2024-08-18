<template>
  <DesktopPageTitle />
  <div class="profile">
    <ProfileCard />
    <FriendsCard />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Mon profil" });
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}
</style>
