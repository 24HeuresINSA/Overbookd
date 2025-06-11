export default defineNuxtPlugin(() => {
  const token = useCookie(ACCESS_TOKEN).value;

  if (!token) return;
  const authStore = useAuthStore();
  authStore.scheduleRefresh();
});
