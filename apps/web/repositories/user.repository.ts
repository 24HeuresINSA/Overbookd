import type { PlanningEvent } from "@overbookd/assignment";
import type { AssignmentStat, Consumer, PlanningTask } from "@overbookd/http";
import type {
  MyUserInformation,
  Profile,
  User,
  UserPersonalData,
  UserUpdateForm,
} from "@overbookd/user";
import { HttpRequest } from "~/utils/http/http-request";
import { ImageRepository } from "~/utils/image/image.repository";

export class UserRepository {
  private static readonly basePath = "users";

  static getUser(userId: number) {
    return HttpRequest.get<UserPersonalData>(`${this.basePath}/${userId}`);
  }

  static getMyUser() {
    return HttpRequest.get<MyUserInformation>(`${this.basePath}/me`);
  }

  static updateMyProfile(profile: Partial<Profile>) {
    return HttpRequest.patch<MyUserInformation>(`${this.basePath}/me`, profile);
  }

  static getAllUsers() {
    return HttpRequest.get<UserPersonalData[]>(this.basePath);
  }

  static getVolunteers() {
    return HttpRequest.get<UserPersonalData[]>(`${this.basePath}/volunteers`);
  }

  static getAdherents() {
    return HttpRequest.get<User[]>(`${this.basePath}/adherents`);
  }

  static getAllPersonalAccountConsumers() {
    return HttpRequest.get<Consumer[]>(
      `${this.basePath}/personal-account-consumers`,
    );
  }

  static async addProfilePicture(profilePicture: FormData) {
    return HttpRequest.post<MyUserInformation>(
      `${this.basePath}/me/profile-picture`,
      profilePicture,
    );
  }

  static async getProfilePicture(userId: number): Promise<string | undefined> {
    const path = `${this.basePath}/${userId}/profile-picture`;
    return ImageRepository.getImage(path);
  }

  static updateUser(userId: number, userData: UserUpdateForm) {
    return HttpRequest.put<UserPersonalData>(
      `${this.basePath}/${userId}`,
      userData,
    );
  }

  static deleteUser(userId: number) {
    return HttpRequest.delete(`${this.basePath}/${userId}`);
  }

  static getFriends() {
    return HttpRequest.get<User[]>("friends");
  }

  static getUserFriends(userId: number) {
    return HttpRequest.get<User[]>(`friends/${userId}`);
  }

  static addFriend(friendId: number) {
    return HttpRequest.post<User>("friends", {
      id: friendId,
    });
  }

  static removeFriend(friendId: number) {
    return HttpRequest.delete<User>(`friends/${friendId}`);
  }

  static addFriendToUser(userId: number, friendId: number) {
    return HttpRequest.post<User>(`friends/${userId}`, {
      id: friendId,
    });
  }

  static removeFriendFromUser(userId: number, friendId: number) {
    return HttpRequest.delete<User>(`friends/${userId}/${friendId}`);
  }

  static getMobilizationsVolunteerTakePartOf(volunteerId: number) {
    return HttpRequest.get<PlanningTask[]>(
      `${this.basePath}/${volunteerId}/mobilizations`,
    );
  }

  static getVolunteerAssignments(userId: number) {
    return HttpRequest.get<PlanningEvent[]>(
      `${this.basePath}/${userId}/assignments`,
    );
  }

  static getVolunteerAssignmentStats(userId: number) {
    return HttpRequest.get<AssignmentStat[]>(
      `${this.basePath}/${userId}/assignments/stats`,
    );
  }

  static addTeamsToUser(userId: number, teams: string[]) {
    return HttpRequest.patch<string[]>(
      `${this.basePath}/${userId}/teams`,
      teams,
    );
  }

  static removeTeamFromUser(userId: number, team: string) {
    return HttpRequest.delete(`${this.basePath}/${userId}/teams/${team}`);
  }
}

class ImageRepository {
  static async getImage(path: string): Promise<string | undefined> {
    const response = await HttpRequest.get(`${process.env.BASE_URL}/${path}`, {
      isJsonContent: false,
    });
    if (response.status !== 200) return undefined;
    const url = URL.createObjectURL(await response.blob());
    return url;
  }
}
