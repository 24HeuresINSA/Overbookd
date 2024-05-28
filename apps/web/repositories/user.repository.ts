import { PlanningEvent } from "@overbookd/assignment";
import {
  AssignmentStat,
  Consumer,
  HttpStringified,
  PlanningTask,
} from "@overbookd/http";
import {
  MyUserInformation,
  Profile,
  User,
  UserPersonalData,
  UserUpdateForm,
} from "@overbookd/user";
import { ImageRepository } from "~/utils/image/image.repository";
import { Context } from "../utils/api/axios";

export class UserRepository {
  private static readonly basePath = "users";

  static getUser(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<UserPersonalData>>(
      `${this.basePath}/${userId}`,
    );
  }

  static getMyUser(context: Context) {
    return context.$axios.get<HttpStringified<MyUserInformation>>(
      `${this.basePath}/me`,
    );
  }

  static updateMyProfile(context: Context, profile: Partial<Profile>) {
    return context.$axios.patch<HttpStringified<MyUserInformation>>(
      `${this.basePath}/me`,
      profile,
    );
  }

  static getAllUsers(context: Context) {
    return context.$axios.get<HttpStringified<UserPersonalData[]>>(
      this.basePath,
    );
  }

  static getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<UserPersonalData[]>>(
      `${this.basePath}/volunteers`,
    );
  }

  static getAdherents(context: Context) {
    return context.$axios.get<HttpStringified<User[]>>(
      `${this.basePath}/adherents`,
    );
  }

  static getAllPersonalAccountConsumers(context: Context) {
    return context.$axios.get<HttpStringified<Consumer[]>>(
      `${this.basePath}/personal-account-consumers`,
    );
  }

  static async addProfilePicture(context: Context, profilePicture: FormData) {
    return context.$axios.post<HttpStringified<MyUserInformation>>(
      `${this.basePath}/me/profile-picture`,
      profilePicture,
    );
  }

  static async getProfilePicture(
    context: Context,
    userId: number,
  ): Promise<string | undefined> {
    const path = `${this.basePath}/${userId}/profile-picture`;
    return ImageRepository.getImage(context, path);
  }

  static updateUser(
    context: Context,
    userId: number,
    userData: UserUpdateForm,
  ) {
    return context.$axios.put<HttpStringified<UserPersonalData>>(
      `${this.basePath}/${userId}`,
      userData,
    );
  }

  static deleteUser(context: Context, userId: number) {
    return context.$axios.delete<void>(`${this.basePath}/${userId}`);
  }

  static getFriends(context: Context) {
    return context.$axios.get<HttpStringified<User[]>>("friends");
  }

  static getUserFriends(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<User[]>>(`friends/${userId}`);
  }

  static addFriend(context: Context, friendId: number) {
    return context.$axios.post<HttpStringified<User>>("friends", {
      id: friendId,
    });
  }

  static removeFriend(context: Context, friendId: number) {
    return context.$axios.delete<HttpStringified<User>>(`friends/${friendId}`);
  }

  static addFriendToUser(context: Context, userId: number, friendId: number) {
    return context.$axios.post<HttpStringified<User>>(`friends/${userId}`, {
      id: friendId,
    });
  }

  static removeFriendFromUser(
    context: Context,
    userId: number,
    friendId: number,
  ) {
    return context.$axios.delete<HttpStringified<User>>(
      `friends/${userId}/${friendId}`,
    );
  }

  static getMobilizationsVolunteerTakePartOf(
    context: Context,
    volunteerId: number,
  ) {
    return context.$axios.get<HttpStringified<PlanningTask[]>>(
      `${this.basePath}/${volunteerId}/mobilizations`,
    );
  }

  static getVolunteerAssignments(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<PlanningEvent[]>>(
      `${this.basePath}/${userId}/assignments`,
    );
  }

  static getVolunteerAssignmentStats(context: Context, userId: number) {
    return context.$axios.get<HttpStringified<AssignmentStat[]>>(
      `${this.basePath}/${userId}/assignments/stats`,
    );
  }

  static addTeamsToUser(context: Context, userId: number, teams: string[]) {
    return context.$axios.patch<HttpStringified<string[]>>(
      `${this.basePath}/${userId}/teams`,
      teams,
    );
  }

  static removeTeamFromUser(context: Context, userId: number, team: string) {
    return context.$axios.delete<void>(
      `${this.basePath}/${userId}/teams/${team}`,
    );
  }
}
