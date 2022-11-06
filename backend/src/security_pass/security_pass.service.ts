import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSecurityPassDto } from './dto/create-security_pass.dto';
import { UpdateSecurityPassDto } from './dto/update-security_pass.dto';

@Injectable()
export class SecurityPassService {
  constructor(private prisma: PrismaService) {}

  create(createSecurityPassDto: CreateSecurityPassDto) {
    return 'This action adds a new securityPass';
  }

  findAll() {
    return `This action returns all securityPass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} securityPass`;
  }

  update(id: number, updateSecurityPassDto: UpdateSecurityPassDto) {
    return `This action updates a #${id} securityPass`;
  }

  remove(id: number) {
    return `This action removes a #${id} securityPass`;
  }
}
