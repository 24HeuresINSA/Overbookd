import type { StaffApplication } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class MembershipApplicationRepository {
  private static readonly basePath = "registrations/membership-applications";

  static applyAsStaff(candidate: StaffApplication) {
    const options = {
      serverErrorMessage:
        "Oups, ta demande de candidature a échoué... Rééssaie de te connecter avec le lien fourni par le.a SG",
    };
    return HttpClient.post<void>(`${this.basePath}/staff`, candidate, options);
  }

  static rejectForStaff(candidateId: number) {
    return HttpClient.delete<void>(`${this.basePath}/staff/${candidateId}`);
  }
}
