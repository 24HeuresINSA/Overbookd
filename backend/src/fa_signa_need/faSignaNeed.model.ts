const BANNIERE = 'BANNIERE';
const PANCARTE = 'PANCARTE';
const PANNEAU = 'PANNEAU';

export const signaTypes: Record<SignaType, SignaType> = {
  BANNIERE,
  PANCARTE,
  PANNEAU,
};

export type SignaType = typeof BANNIERE | typeof PANCARTE | typeof PANNEAU;
