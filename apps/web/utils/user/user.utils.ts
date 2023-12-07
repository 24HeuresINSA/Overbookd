import { UserName } from "@overbookd/user";

export function formatUsername({ firstname, lastname }: UserName): string {
  return `${firstname} ${lastname}`;
}

export function formatUserNameWithNickname({
  lastname,
  firstname,
  nickname,
}: UserName): string {
  const displayedNickname = nickname ? `(${nickname})` : "";
  return `${firstname} ${lastname} ${displayedNickname}`;
}

export function formatUserPhone(userPhone: string) {
  const phone = (userPhone ?? "").padStart(10, "0");
  return phone.replace(/(\d{2})/g, "$1 ");
}

export function formatPhoneLink(userPhone: string) {
  const phone = (userPhone ?? "").replace(/^0/, "");
  return `tel:+33${phone}`;
}
