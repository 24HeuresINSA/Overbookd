export const AUCUN_AMI = {
  key: "no-friend",
  label: "Aucun·e ami·e",
} as const;
export const AMIS_DISPONIBLES = { 
  key: "available-friends",
  label: "Ami·e·s disponibles"
} as const;
export const AMIS_DEJA_AFFECTES = { 
  key: "already-assigned-friends",
  label: "Ami·e·s déjà affectés"
} as const;

export type FriendFilterKey =
  | typeof AUCUN_AMI.key
  | typeof AMIS_DISPONIBLES.key
  | typeof AMIS_DEJA_AFFECTES.key;

export const friendFilters = [
  AUCUN_AMI,
  AMIS_DISPONIBLES,
  AMIS_DEJA_AFFECTES,
];

export const isFriendFilterKey = (value: string): value is FriendFilterKey => {
  return friendFilters.some(filter => filter.key === value);
}
