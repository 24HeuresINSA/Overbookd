import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { FriendCreationDto } from "./dto/friendCreation.dto";
import { FriendResponseDto } from "./dto/friendResponse.dto";

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async findMany(id: number): Promise<FriendResponseDto[] | null> {
    const friends = await this.prisma.friend.findMany({
      where: {
        requestorId: id,
      },
      select: {
        friend: {
          select: {
            id: true,
            lastname: true,
            firstname: true,
          },
        },
      },
    });

    return friends.map(({ friend }) => ({
      id: friend.id,
      firstname: friend.firstname,
      lastname: friend.lastname,
    }));
  }

  async create(id: number, friend: FriendCreationDto): Promise<FriendResponseDto | null> {
    const newFriend = await this.prisma.friend.create({
      data: {
        requestorId: id,
        friendId: friend.id,
      },
      select: {
        friend: {
          select: {
            id: true,
            lastname: true,
            firstname: true,
          },
        },
      },
    });

    return {
      id: newFriend.friend.id,
      firstname: newFriend.friend.firstname,
      lastname: newFriend.friend.lastname,
    };
  }

  async delete(userId: number, friendId : number ): Promise<void> {
    await this.prisma.friend.delete({
      where: {
        requestorId_friendId: {
          requestorId: userId,
          friendId: friendId,
        },
      },
    });
  } 
}