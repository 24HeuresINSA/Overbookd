import { Injectable } from '@nestjs/common';
import { CreateFaSignaNeedDto } from './dto/create-fa_signa_need.dto';
import { UpdateFaSignaNeedDto } from './dto/update-fa_signa_need.dto';
import { PrismaService } from '../prisma.service';
import { NotFoundError } from '@prisma/client/runtime';

@Injectable()
export class FaSignaNeedsService {
  constructor(private prisma: PrismaService) {}

  /**     **/
  /** POST **/
  /**     **/

  async findAll(): Promise<FA_Signa_Needs[] | null> {
    return this.prisma.fA_signa_needs.findMany();
    
  }

  findOne(id: number) {
    return `This action returns a #${id} faSignaNeed`;
  }

  update(id: number, updateFaSignaNeedDto: UpdateFaSignaNeedDto) {
    return `This action updates a #${id} faSignaNeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} faSignaNeed`;
  }
}
