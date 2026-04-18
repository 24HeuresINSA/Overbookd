export const AUCUN_AMI = "Aucun·e ami·e";
export const AMIS_DISPONIBLES = "Ami·e·s disponibles";
export const AMIS_DEJA_AFFECTES = "Ami·e·s déjà affectés";

export type FriendFilter =
  | typeof AUCUN_AMI
  | typeof AMIS_DISPONIBLES
  | typeof AMIS_DEJA_AFFECTES;

export const friendFilterLabel: FriendFilter[] = [
  AUCUN_AMI,
  AMIS_DISPONIBLES,
  AMIS_DEJA_AFFECTES,
];
