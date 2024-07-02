export function sendNotification(
  message: string | string[],
  duration?: number,
) {
  const stringMessage = Array.isArray(message) ? message.join("\n") : message;
  const { pushNotification } = useSnackNotificationStore();
  pushNotification(stringMessage, duration);
}
