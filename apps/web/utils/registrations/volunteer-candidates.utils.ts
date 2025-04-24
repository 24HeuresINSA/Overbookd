import type { VolunteerCandidate } from "@overbookd/http";
import { formatDate } from "@overbookd/time";

type VolunteerCandidateWithRejectionStatus = Omit<
  VolunteerCandidate,
  "candidatedAt"
> & {
  candidatedAt: string;
  isRejected: boolean;
};

export function buildVolunteerCandidateWithRejectionStatus(
  candidate: VolunteerCandidate,
  isRejected: boolean,
): VolunteerCandidateWithRejectionStatus {
  return {
    ...candidate,
    candidatedAt: formatDate(candidate.candidatedAt),
    isRejected,
  };
}
