import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FA_Comment } from '@prisma/client';
import { FaCommentService } from './fa_comment.service';
import { CreateFaCommentDto } from './dto/create-fa-comment.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/team-auth.guard';
import { Roles } from '../../auth/team-auth.decorator';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa/:faId/comments')
export class FaCommentController {
  constructor(private readonly faCommentService: FaCommentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @Post()
  async create(
    @Param('faId', ParseIntPipe) faId: number,
    @Body() createFaCommentDto: CreateFaCommentDto[],
  ): Promise<FA_Comment[] | null> {
    await this.faCommentService.createFAComments(faId, createFaCommentDto);
    return this.faCommentService.find(faId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('hard')
  @ApiResponse({
    status: 200,
    description: "Get all fa's comments",
  })
  async findCommentByFA(
    @Param('faId', ParseIntPipe) faId: number,
  ): Promise<FA_Comment[] | null> {
    return this.faCommentService.find(faId);
  }
}
