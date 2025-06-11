export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  const token = useCookie(ACCESS_TOKEN).value;

  if (!token) return;
  authStore.authenticated = true;
  authStore.scheduleRefresh();
});
