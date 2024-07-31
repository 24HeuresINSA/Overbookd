export function formatUserPhone(userPhone: string) {
  const phone = (userPhone ?? "").padStart(10, "0");
  return phone.replace(/(\d{2})/g, "$1 ");
}

export function formatPhoneLink(userPhone: string) {
  const phone = (userPhone ?? "").replace(/^0/, "");
  return `tel:+33${phone}`;
}

export function formatEmailLink(email: string) {
  return `mailto:${email}`;
}
