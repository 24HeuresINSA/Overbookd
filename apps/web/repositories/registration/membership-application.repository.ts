import type { StaffApplication } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class MembershipApplicationRepository {
  private static readonly basePath = "registrations/membership-applications";

  static applyAsStaff(candidate: StaffApplication) {
    return HttpClient.post<void>(`${this.basePath}/staff`, candidate);
  }

  static rejectForStaff(candidateId: number) {
    return HttpClient.delete<void>(`${this.basePath}/staff/${candidateId}`);
  }
}
