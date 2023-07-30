const CLOSED = 'CLOSED';
const SOFT = 'SOFT';
const HARD = 'HARD';

export const registerFormStates: Record<RegisterFormState, RegisterFormState> = {
  CLOSED,
  SOFT,
  HARD,
};

export type RegisterFormState = typeof CLOSED | typeof SOFT | typeof HARD;