const DRAFT = "DRAFT";
const SUBMITTED = "SUBMITTED";
const VALIDATED = "VALIDATED";
const REFUSED = "REFUSED";
const READY = "READY";

export const ftStatuses: Record<FtStatus, FtStatus> = {
  DRAFT,
  SUBMITTED,
  VALIDATED,
  REFUSED,
  READY,
};

export type FtStatus =
  | typeof DRAFT
  | typeof SUBMITTED
  | typeof VALIDATED
  | typeof REFUSED
  | typeof READY;
