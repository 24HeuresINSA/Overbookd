<template>
  <h1>Index</h1>
  <v-btn @click="logout"> Logout </v-btn>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();

const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
