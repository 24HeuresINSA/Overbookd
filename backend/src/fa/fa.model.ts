const DRAFT = 'DRAFT';
const SUBMITTED = 'SUBMITTED';
const VALIDATED = 'VALIDATED';
const REFUSED = 'REFUSED';

export const faStatus: Record<FaStatus, FaStatus> = {
  DRAFT,
  SUBMITTED,
  VALIDATED,
  REFUSED,
};

export type FaStatus =
  | typeof DRAFT
  | typeof SUBMITTED
  | typeof VALIDATED
  | typeof REFUSED;
