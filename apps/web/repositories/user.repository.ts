import type { PlanningEvent } from "@overbookd/assignment";
import type { AssignmentStat, Consumer, PlanningTask } from "@overbookd/http";
import type {
  MyUserInformation,
  Profile,
  User,
  UserPersonalData,
  UserUpdateForm,
} from "@overbookd/user";
import { HttpClient } from "~/utils/http/http-client";
import { ImageRepository } from "~/utils/http/image.repository";

export class UserRepository {
  private static readonly basePath = "users";

  static getUser(userId: number) {
    return HttpClient.get<UserPersonalData>(`${this.basePath}/${userId}`);
  }

  static getMyUser() {
    return HttpClient.get<MyUserInformation>(`${this.basePath}/me`);
  }

  static updateMyProfile(profile: Partial<Profile>) {
    return HttpClient.patch<MyUserInformation>(`${this.basePath}/me`, profile);
  }

  static approveEndUserLicenceAgreement() {
    return HttpClient.post(`${this.basePath}/me/approve-eula`);
  }

  static getAllUsers() {
    return HttpClient.get<UserPersonalData[]>(this.basePath);
  }

  static getVolunteers() {
    return HttpClient.get<UserPersonalData[]>(`${this.basePath}/volunteers`);
  }

  static getAdherents() {
    return HttpClient.get<User[]>(`${this.basePath}/adherents`);
  }

  static getAllPersonalAccountConsumers() {
    return HttpClient.get<Consumer[]>(
      `${this.basePath}/personal-account-consumers`,
    );
  }

  static async addProfilePicture(profilePicture: FormData) {
    return HttpClient.post<MyUserInformation>(
      `${this.basePath}/me/profile-picture`,
      profilePicture,
    );
  }

  static async getProfilePicture(userId: number): Promise<string | Error> {
    const path = `${this.basePath}/${userId}/profile-picture`;
    return ImageRepository.getImage(path);
  }

  static updateUser(userId: number, userData: UserUpdateForm) {
    return HttpClient.put<UserPersonalData>(
      `${this.basePath}/${userId}`,
      userData,
    );
  }

  static deleteUser(userId: number) {
    return HttpClient.delete(`${this.basePath}/${userId}`);
  }

  static getFriends() {
    return HttpClient.get<User[]>("friends");
  }

  static getUserFriends(userId: number) {
    return HttpClient.get<User[]>(`friends/${userId}`);
  }

  static addFriend(friendId: number) {
    return HttpClient.post<User>("friends", { id: friendId });
  }

  static removeFriend(friendId: number) {
    return HttpClient.delete(`friends/${friendId}`);
  }

  static addFriendToUser(userId: number, friendId: number) {
    return HttpClient.post<User>(`friends/${userId}`, { id: friendId });
  }

  static removeFriendFromUser(userId: number, friendId: number) {
    return HttpClient.delete(`friends/${userId}/${friendId}`);
  }

  static getMobilizationsVolunteerTakePartOf(volunteerId: number) {
    return HttpClient.get<PlanningTask[]>(
      `${this.basePath}/${volunteerId}/mobilizations`,
    );
  }

  static getVolunteerAssignments(userId: number) {
    return HttpClient.get<PlanningEvent[]>(
      `${this.basePath}/${userId}/assignments`,
    );
  }

  static getVolunteerAssignmentStats(userId: number) {
    return HttpClient.get<AssignmentStat[]>(
      `${this.basePath}/${userId}/assignments/stats`,
    );
  }

  static addTeamsToUser(userId: number, teams: string[]) {
    return HttpClient.patch<string[]>(
      `${this.basePath}/${userId}/teams`,
      teams,
    );
  }

  static removeTeamFromUser(userId: number, team: string) {
    return HttpClient.delete(`${this.basePath}/${userId}/teams/${team}`);
  }
}
