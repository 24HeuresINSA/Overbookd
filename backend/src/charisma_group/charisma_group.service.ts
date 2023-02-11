import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CharismaGroupResponseDto } from './dto/charismaGroupResponse.dto';
import { CreateCharismaGroupDto } from './dto/createCharsimaGroup.dto';
import { UpdateCharismaGroupDto } from './dto/updateCharismaGroup.dto';

@Injectable()
export class CharismaGroupService {
  constructor(private prisma: PrismaService) {}

  async createCharismaGroup(
    charismaGroup: CreateCharismaGroupDto,
  ): Promise<CharismaGroupResponseDto> {
    return this.prisma.charismaGroup.create({
      data: charismaGroup,
    });
  }

  async updateCharismaGroup(
    charismaGroup: UpdateCharismaGroupDto,
    id: number,
  ): Promise<CharismaGroupResponseDto> {
    return this.prisma.charismaGroup.update({
      where: { id },
      data: charismaGroup,
    });
  }

  async findAllCharismaGroups(): Promise<CharismaGroupResponseDto[]> {
    return this.prisma.charismaGroup.findMany();
  }

  async findOneCharismaGroup(id: number): Promise<CharismaGroupResponseDto> {
    return this.prisma.charismaGroup.findUnique({
      where: { id },
    });
  }

  async deleteCharismaGroup(id: number): Promise<void> {
    await this.prisma.charismaGroup.delete({
      where: { id },
    });
  }
}
