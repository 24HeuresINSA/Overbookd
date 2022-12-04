import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { FaCommentService } from './fa_comment.service';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/team-auth.guard';
import { Roles } from '../auth/team-auth.decorator';
import { fa_comments } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('fa-comment')
@Controller('fa-comment')
export class FaCommentController {
  constructor(private readonly faCommentService: FaCommentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post(':faid')
  @ApiBody({ type: [CreateFaCommentDto] })
  upsert(
    @Param('faid', ParseIntPipe) faID: string,
    @Body() createFaCommentDto: CreateFaCommentDto[],
  ): Promise<fa_comments[] | null> {
    return this.faCommentService.upsert(+faID, createFaCommentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get()
  findAll(): Promise<fa_comments[] | null> {
    return this.faCommentService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<fa_comments | null> {
    return this.faCommentService.findOne(+id);
  }
}
