import UserModel, { User } from "@entities/User";
import { BaseEntityService } from "@shared/BaseEntity";

class UserService extends BaseEntityService<User> {
  model = UserModel;

  findByEmail = async (email: string): Promise<User> => {
    const user = await this.model.findOne({ email });
    if (!user) {
      throw new Error(`User not found for email: ${email}`);
    }
    return user;
  };

  findUserForLogin = async (email: string): Promise<User> => {
    const user = await UserModel.findOne({ email }).select("_id password");
    if (!user) {
      throw new Error(`User not found for email: ${email}`);
    }
    return user;
  };

  findByResetPasswordToken = async (
    resetPasswordToken: string
  ): Promise<User> => {
    const user = await UserModel.findOne({ resetPasswordToken });
    if (!user) {
      throw new Error(
        `User not found for resetPasswordToken: ${resetPasswordToken}`
      );
    }
    return user;
  };

  userExistByEmail = async (email: string): Promise<boolean> => {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return false;
    }
    return true;
  };

  getAllUsersWithCP = async (): Promise<User[]> => {
    const users = await UserModel.find(
      {
        team: { $in: ["hard", "vieux"] },
      },
      { firstname: 1, lastname: 1 }
    );
    return users;
  };
}

const UserServiceInstance = new UserService();
export default UserServiceInstance;
