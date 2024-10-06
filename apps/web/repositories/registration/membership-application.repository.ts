import type {
  StaffCandidate,
  VolunteerCandidate,
  StaffApplication,
} from "@overbookd/http";
import type { CandidateToEnroll } from "@overbookd/registration";
import { HttpClient } from "~/utils/http/http-client";

export class MembershipApplicationRepository {
  private static readonly basePath = "registrations/membership-applications";

  static applyAsStaff(candidate: StaffApplication) {
    const options = {
      serverErrorMessage:
        "Oups, ta demande de candidature a échoué... Rééssaie de te connecter avec le lien fourni par le.a SG",
    };
    return HttpClient.post<void>(`${this.basePath}/staffs`, candidate, options);
  }

  static rejectForStaff(candidateId: number) {
    return HttpClient.delete<void>(`${this.basePath}/staffs/${candidateId}`);
  }

  static getStaffCandidates() {
    return HttpClient.get<StaffCandidate[]>(`${this.basePath}/staffs`);
  }

  static getRecentStaffNewcomersCount() {
    return HttpClient.get<number>(`${this.basePath}/staffs/unenrolled/count`);
  }

  static enrollStaffs(candidates: CandidateToEnroll[]) {
    return HttpClient.post<void>(`${this.basePath}/staffs/enroll`, {
      candidates,
    });
  }

  static getVolunteerCandidates() {
    return HttpClient.get<VolunteerCandidate[]>(`${this.basePath}/volunteers`);
  }

  static getVolunteer(volunteerId: VolunteerCandidate["id"]) {
    return HttpClient.get<VolunteerCandidate>(
      `${this.basePath}/volunteers/${volunteerId}`,
    );
  }

  static enrollNewVolunteers(newcomers: CandidateToEnroll[]) {
    return HttpClient.post<void>(`${this.basePath}/volunteers/enroll`, {
      newcomers,
    });
  }

  static generateStaffLink() {
    return HttpClient.post<string>(`${this.basePath}/staffs/invitation-link`);
  }

  static fetchStaffLink() {
    return HttpClient.get<string>(`${this.basePath}/staffs/invitation-link`);
  }
}
