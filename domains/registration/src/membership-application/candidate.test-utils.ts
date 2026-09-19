import { Edition } from "@overbookd/time";
import { STAFF, VOLUNTEER } from "../newcomer.js";
import { Candidate } from "./candidates.js";

export const lea = { id: 1 };
export const leaStaffCandidate: Candidate = {
  ...lea,
  membership: STAFF,
  edition: Edition.current,
  isRejected: false,
  candidatedAt: new Date(),
};
export const leaVolunteerCandidate: Candidate = {
  ...lea,
  membership: VOLUNTEER,
  edition: Edition.current,
  isRejected: false,
  candidatedAt: new Date(),
};

export const noel = { id: 2 };
const previousEdition = Edition.current - 1;
export const noelCandidate: Candidate = {
  ...noel,
  membership: STAFF,
  edition: previousEdition,
  isRejected: false,
  candidatedAt: new Date(),
};

export const olop = { id: 3 };
export const rejectedOlopStaffCandidate: Candidate = {
  ...olop,
  membership: STAFF,
  edition: Edition.current,
  isRejected: true,
  candidatedAt: new Date(),
};

export const rejectedOlopVolunteerCandidate: Candidate = {
  ...olop,
  membership: VOLUNTEER,
  edition: Edition.current,
  isRejected: true,
  candidatedAt: new Date(),
};

export const oel = { id: 3 };
export const oelCandidate: Candidate = {
  ...oel,
  membership: VOLUNTEER,
  edition: Edition.current,
  isRejected: false,
  candidatedAt: new Date(),
};

export const cul = { id: 4 };
export const culCandidate: Candidate = {
  ...cul,
  membership: VOLUNTEER,
  edition: previousEdition,
  isRejected: false,
  candidatedAt: new Date(),
};

export const dnamra = { id: 5 };
export const rejectedDnamraCandidate: Candidate = {
  ...dnamra,
  membership: VOLUNTEER,
  edition: Edition.current,
  isRejected: true,
  candidatedAt: new Date(),
};
