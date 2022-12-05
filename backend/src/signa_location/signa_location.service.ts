import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSignaLocationDto } from './dto/create-signa_location.dto';
import { UpdateSignaLocationDto } from './dto/update-signa_location.dto';

@Injectable()
export class SignaLocationService {
  constructor(private prisma: PrismaService) {}
  create(createSignaLocationDto: CreateSignaLocationDto) {
    return this.prisma.signa_Location.create({
      data: createSignaLocationDto,
    });
  }

  findAll() {
    return this.prisma.signa_Location.findMany();
  }

  findOne(id: number) {
    return this.prisma.signa_Location.findUnique({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateSignaLocationDto: UpdateSignaLocationDto) {
    return this.prisma.signa_Location.update({
      where: {
        id: id,
      },
      data: updateSignaLocationDto,
    });
  }

  remove(id: number) {
    return this.prisma.signa_Location.delete({
      where: {
        id: id,
      },
    });
  }
}
