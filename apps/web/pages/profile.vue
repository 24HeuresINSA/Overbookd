<template>
  <div class="profile">
    <h1>Profil</h1>
    <UserCard />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Mon profil" });
</script>

<style lang="scss" scoped>
h1 {
  padding-left: 10px;
}
</style>
