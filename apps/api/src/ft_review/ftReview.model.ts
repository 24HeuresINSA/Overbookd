const VALIDATED = 'VALIDATED';
const REFUSED = 'REFUSED';

export type ReviewStatus = typeof VALIDATED | typeof REFUSED;

export const reviewStatuses: Record<ReviewStatus, ReviewStatus> = {
  VALIDATED,
  REFUSED,
};
