import UserModel, { User } from "@entities/User";
import { Types } from "mongoose";

export const findAll = async (): Promise<User[]> => {
  return UserModel.find();
};

export const findById = async (id: string): Promise<User> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getAllUsersWithCP = async (): Promise<User[]> => {
  const users = await UserModel.find(
    {
      team: { $in: ["hard", "vieux"] },
    },
    { firstname: 1, lastname: 1 }
  );
  return users;
};

export const save = async (user: User): Promise<User> => {
  return UserModel.create(user);
};

export const updateById = async (
  id: string | Types.ObjectId,
  user: Partial<User>
): Promise<User> => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, user, {
    new: true,
  });
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
};
