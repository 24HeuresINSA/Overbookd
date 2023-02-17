import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VolunteerAvailabilityService {
  constructor(private prisma: PrismaService) {}
}
