const BACHE = 'BACHE';
const PANNEAU = 'PANNEAU';
const AFFICHE = 'AFFICHE';

export const signaTypes: Record<SignaType, SignaType> = {
  BACHE,
  PANNEAU,
  AFFICHE,
};

export type SignaType = typeof BACHE | typeof PANNEAU | typeof AFFICHE;
