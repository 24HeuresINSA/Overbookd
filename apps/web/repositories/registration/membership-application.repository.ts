import type { StaffCandidate, VolunteerCandidate } from "@overbookd/http";
import type { CandidateToEnroll } from "@overbookd/registration";
import { HttpClient } from "~/utils/http/http-client";

export class MembershipApplicationRepository {
  private static readonly basePath = "registrations/membership-applications";

  static generateStaffLink() {
    return HttpClient.post<string>(`${this.basePath}/staffs/invitation-link`);
  }

  static fetchStaffLink() {
    return HttpClient.get<string>(`${this.basePath}/staffs/invitation-link`);
  }

  static rejectStaffCandidate(candidateId: number) {
    return HttpClient.delete<void>(`${this.basePath}/staffs/${candidateId}`);
  }

  static cancelStaffCandidateRejection(candidateId: number) {
    return HttpClient.post<void>(
      `${this.basePath}/staffs/${candidateId}/cancel-rejection`,
    );
  }

  static getStaffCandidates() {
    return HttpClient.get<StaffCandidate[]>(`${this.basePath}/staffs`);
  }

  static getStaffCandidatesCount() {
    return HttpClient.get<number>(`${this.basePath}/staffs/candidates/count`);
  }

  static getRejectedStaffCandidates() {
    return HttpClient.get<StaffCandidate[]>(`${this.basePath}/staffs/rejected`);
  }

  static enrollNewStaffs(candidates: CandidateToEnroll[]) {
    return HttpClient.post<void>(`${this.basePath}/staffs/enroll`, {
      candidates,
    });
  }

  static getVolunteerCandidates() {
    return HttpClient.get<VolunteerCandidate[]>(`${this.basePath}/volunteers`);
  }

  static getVolunteerCandidatesCount() {
    return HttpClient.get<number>(
      `${this.basePath}/volunteers/candidates/count`,
    );
  }

  static getRejectedVolunteerCandidates() {
    return HttpClient.get<VolunteerCandidate[]>(
      `${this.basePath}/volunteers/rejected`,
    );
  }

  static enrollNewVolunteers(candidates: CandidateToEnroll[]) {
    return HttpClient.post<void>(`${this.basePath}/volunteers/enroll`, {
      candidates,
    });
  }

  static rejectVolunteerCandidate(candidateId: number) {
    return HttpClient.delete<void>(
      `${this.basePath}/volunteers/${candidateId}`,
    );
  }

  static cancelVolunteerCandidateRejection(candidateId: number) {
    return HttpClient.post<void>(
      `${this.basePath}/volunteers/${candidateId}/cancel-rejection`,
    );
  }
}
