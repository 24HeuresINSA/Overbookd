import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FriendResponseDto } from './dto/friendResponse.dto';
import { FriendWithData } from './friend.types';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  private readonly SELECT_FRIEND = {
    id: true,
    lastname: true,
    firstname: true,
    nickname: true,
  };

  async findUserFriends(id: number): Promise<FriendResponseDto[] | null> {
    const friends = await this.prisma.friend.findMany({
      where: {
        requestorId: id,
      },
      select: {
        friend: {
          select: this.SELECT_FRIEND,
        },
      },
    });

    return friends.map(retrieveFriend);
  }

  async findFriends(): Promise<FriendResponseDto[]> {
    const nonFriendableTeams = ['fen', 'voiture', 'camion'];

    return this.prisma.user.findMany({
      select: this.SELECT_FRIEND,
      where: {
        team: {
          none: {
            team: {
              code: { in: nonFriendableTeams },
            },
          },
        },
      },
    });
  }

  async create(
    requestorId: number,
    friendId: number,
  ): Promise<FriendResponseDto | null> {
    const { friend } = await this.prisma.friend.create({
      data: {
        requestorId,
        friendId,
      },
      select: {
        friend: {
          select: this.SELECT_FRIEND,
        },
      },
    });

    return friend;
  }

  async delete(requestorId: number, friendId: number): Promise<void> {
    await this.prisma.friend.delete({
      where: {
        requestorId_friendId: {
          requestorId,
          friendId,
        },
      },
    });
  }
}

function retrieveFriend({ friend }: FriendWithData): FriendResponseDto {
  return {
    id: friend.id,
    firstname: friend.firstname,
    lastname: friend.lastname,
    nickname: friend.nickname,
  };
}
