import type { AssignmentEvent } from "@overbookd/assignment";
import type { Consumer, PlanningTask } from "@overbookd/http";
import type {
  MyUserInformation,
  Profile,
  User,
  UserPersonalData,
  UserUpdateForm,
  UserWithTeams,
} from "@overbookd/user";
import { HttpClient } from "~/utils/http/http-client";

export class UserRepository {
  private static readonly basePath = "users";

  static userSync() {
    return HttpClient.post(`${this.basePath}/sync`);
  }

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

  static signVolunteerCharter() {
    return HttpClient.post(`${this.basePath}/me/sign-volunteer-charter`);
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

  static updateUser(userId: number, userData: UserUpdateForm) {
    return HttpClient.put<UserPersonalData>(
      `${this.basePath}/${userId}`,
      userData,
    );
  }

  static deleteUser(userId: number) {
    return HttpClient.delete(`${this.basePath}/${userId}`);
  }

  static shouldAnonymizeUser(userId: number) {
    return HttpClient.get<boolean>(
      `${this.basePath}/${userId}/should-anonymize`,
    );
  }

  static getFriendsFor(userId: number) {
    return HttpClient.get<UserWithTeams[]>(`friends/for/${userId}`);
  }

  static getUserFriends(userId: number) {
    return HttpClient.get<UserWithTeams[]>(`friends/${userId}`);
  }

  static addFriend(friendId: number) {
    return HttpClient.post<UserWithTeams>("friends", { id: friendId });
  }

  static removeFriend(friendId: number) {
    return HttpClient.delete(`friends/${friendId}`);
  }

  static addFriendToUser(userId: number, friendId: number) {
    return HttpClient.post<UserWithTeams>(`friends/${userId}`, {
      id: friendId,
    });
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
    return HttpClient.get<AssignmentEvent[]>(
      `${this.basePath}/${userId}/assignments`,
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
