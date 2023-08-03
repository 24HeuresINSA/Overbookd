import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSignaLocationRequestDto } from './dto/create-signa-location.request.dto';
import { UpdateSignaLocationRequestDto } from './dto/update-signa-location.request.dto';

@Injectable()
export class SignaLocationService {
  constructor(private prisma: PrismaService) {}
  create(createSignaLocationDto: CreateSignaLocationRequestDto) {
    return this.prisma.signaLocation.create({
      data: createSignaLocationDto,
    });
  }

  findAll() {
    return this.prisma.signaLocation.findMany();
  }

  findOne(id: number) {
    return this.prisma.signaLocation.findUnique({
      where: { id },
    });
  }

  update(id: number, updateSignaLocationDto: UpdateSignaLocationRequestDto) {
    return this.prisma.signaLocation.update({
      where: { id },
      data: updateSignaLocationDto,
    });
  }

  remove(id: number) {
    return this.prisma.signaLocation.delete({
      where: { id },
    });
  }
}
