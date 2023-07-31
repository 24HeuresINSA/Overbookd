const CLOSED = 'CLOSED';
const OPEN_TO_SOFT = 'OPEN_TO_SOFT';
const OPEN_TO_HARD = 'OPEN_TO_HARD';

export const registerFormStates: Record<RegisterFormState, RegisterFormState> = {
  CLOSED,
  OPEN_TO_SOFT,
  OPEN_TO_HARD,
};

export type RegisterFormState = typeof CLOSED | typeof OPEN_TO_SOFT | typeof OPEN_TO_HARD;