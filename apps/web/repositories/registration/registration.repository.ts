import {
  type Credentials,
  type NewcomerToEnroll,
  RegisterForm,
} from "@overbookd/registration";
import type { EnrollableStaff, EnrollableVolunteer } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static getStaffs() {
    return HttpClient.get<EnrollableStaff[]>(`${this.basePath}/staffs`);
  }

  static getRecentStaffNewcomersCount() {
    return HttpClient.get<number>(`${this.basePath}/staffs/unenrolled/count`);
  }

  static enrollStaffs(newcomers: NewcomerToEnroll[]) {
    return HttpClient.post<void>(`${this.basePath}/staffs/enroll`, {
      newcomers,
    });
  }

  static getVolunteers() {
    return HttpClient.get<EnrollableVolunteer[]>(`${this.basePath}/volunteers`);
  }

  static getVolunteer(volunteerId: EnrollableVolunteer["id"]) {
    return HttpClient.get<EnrollableVolunteer>(
      `${this.basePath}/volunteers/${volunteerId}`,
    );
  }

  static enrollNewVolunteers(newcomers: NewcomerToEnroll[]) {
    return HttpClient.post<void>(`${this.basePath}/volunteers/enroll`, {
      newcomers,
    });
  }

  static generateStaffLink() {
    return HttpClient.post<string>(`${this.basePath}/invite-staff-link`);
  }

  static fetchStaffLink() {
    return HttpClient.get<string>(`${this.basePath}/invite-staff-link`);
  }

  static registerNewcomer(form: RegisterForm, token?: string) {
    const newcomer = form.complete();
    return HttpClient.post<void>(`${this.basePath}`, { token, newcomer });
  }

  static forgetMe(credentials: Credentials, token: string) {
    const body = { token, credentials };
    return HttpClient.post<void>(`${this.basePath}/forget`, body);
  }

  static forgetHim(email: string) {
    return HttpClient.delete<void>(`${this.basePath}/forget/${email}`);
  }
}
