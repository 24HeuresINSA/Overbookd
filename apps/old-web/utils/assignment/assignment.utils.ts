export const AUCUN_AMI = "Aucun ami";
export const AMIS_DISPONIBLES = "Amis disponibles";
export const AMIS_DEJA_AFFECTES = "Amis déjà affectés";

export type FriendFilter =
  | typeof AUCUN_AMI
  | typeof AMIS_DISPONIBLES
  | typeof AMIS_DEJA_AFFECTES;

export const friendFilterLabel: FriendFilter[] = [
  AUCUN_AMI,
  AMIS_DISPONIBLES,
  AMIS_DEJA_AFFECTES,
];
