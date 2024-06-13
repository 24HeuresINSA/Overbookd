export function sendNotification(message: string, duration?: number) {
  const { pushNotification } = useSnackNotificationStore();
  pushNotification(message, duration);
}
