const BANNIERE = 'BANNIERE';
const PANCARTE = 'PANCARTE';
const PANNEAU = 'PANNEAU';

export const signaType: Record<SignaType, SignaType> = {
  BANNIERE,
  PANCARTE,
  PANNEAU,
};

export type SignaType = typeof BANNIERE | typeof PANCARTE | typeof PANNEAU;
