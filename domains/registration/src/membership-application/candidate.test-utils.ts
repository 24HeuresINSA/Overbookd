import { Edition } from "@overbookd/time";
import { STAFF } from "../newcomer.js";
import { Candidate } from "./candidates.js";

export const lea = { email: "lea.mouyno@gmail.com" };
export const leaCandidate: Candidate = {
  ...lea,
  membership: STAFF,
  edition: Edition.current,
  isRejected: false,
};

export const noel = { email: "noel.ertsemud@gmail.com" };
const previousEdition = Edition.current - 1;
export const noelCandidate: Candidate = {
  ...noel,
  membership: STAFF,
  edition: previousEdition,
  isRejected: false,
};

export const olop = { email: "olop@gmail.com" };
export const rejectedOlopCandidate: Candidate = {
  ...olop,
  membership: STAFF,
  edition: Edition.current,
  isRejected: true,
};
