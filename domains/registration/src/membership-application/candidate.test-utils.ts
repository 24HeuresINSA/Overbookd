import { Edition } from "@overbookd/time";
import { STAFF, VOLUNTEER } from "../newcomer.js";
import { Candidate } from "./candidates.js";

export const lea = { email: "lea.mouyno@gmail.com" };
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

export const noel = { email: "noel.ertsemud@gmail.com" };
const previousEdition = Edition.current - 1;
export const noelCandidate: Candidate = {
  ...noel,
  membership: STAFF,
  edition: previousEdition,
  isRejected: false,
  candidatedAt: new Date(),
};

export const olop = { email: "olop@gmail.com" };
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

export const oel = { email: "eol.anyuom@gmail.com" };
export const oelCandidate: Candidate = {
  ...oel,
  membership: VOLUNTEER,
  edition: Edition.current,
  isRejected: false,
  candidatedAt: new Date(),
};

export const cul = { email: "cul.nehgahrednav@gmail.com" };
export const culCandidate: Candidate = {
  ...cul,
  membership: VOLUNTEER,
  edition: previousEdition,
  isRejected: false,
  candidatedAt: new Date(),
};

export const dnamra = { email: "dnamra.tenurb@gmail.com" };
export const rejectedDnamraCandidate: Candidate = {
  ...dnamra,
  membership: VOLUNTEER,
  edition: Edition.current,
  isRejected: true,
  candidatedAt: new Date(),
};
