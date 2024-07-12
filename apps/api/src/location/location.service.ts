import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateLocationRequestDto } from "./dto/create-location.request.dto";
import { UpdateLocationRequestDto } from "./dto/update-location.request.dto";

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.signaLocation.findMany({ orderBy: { name: "asc" } });
  }

  findOne(id: number) {
    return this.prisma.signaLocation.findUnique({ where: { id } });
  }

  create(location: CreateLocationRequestDto) {
    return this.prisma.signaLocation.create({ data: location });
  }

  update(id: number, location: UpdateLocationRequestDto) {
    return this.prisma.signaLocation.update({
      where: { id },
      data: location,
    });
  }

  remove(id: number) {
    return this.prisma.signaLocation.delete({ where: { id } });
  }
}
