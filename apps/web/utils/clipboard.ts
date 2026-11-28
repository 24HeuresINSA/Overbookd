export async function copyToClipboard(
  value: string,
  successMessage: string,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
    sendInfoNotification(successMessage);
  } catch {
    sendFailureNotification("Impossible de copier dans le presse-papier");
  }
}
