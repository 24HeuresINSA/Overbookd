import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EnrichedFAComments, FaCommentService } from './fa_comment.service';
import { CreateFaCommentDto } from './dto/create-fa_comment.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permission } from 'src/auth/permissions-auth.decorator';
import { PermissionsGuard } from 'src/auth/permissions-auth.guard';

@ApiBearerAuth()
@ApiTags('fa')
@Controller('fa-comment')
export class FaCommentController {
  constructor(private readonly faCommentService: FaCommentService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Post(':faid')
  @ApiBody({ type: [CreateFaCommentDto] })
  upsert(
    @Param('faid', ParseIntPipe) faID: string,
    @Body() createFaCommentDto: CreateFaCommentDto[],
  ): Promise<EnrichedFAComments[] | null> {
    return this.faCommentService.upsert(+faID, createFaCommentDto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get()
  findAll(): Promise<EnrichedFAComments[] | null> {
    return this.faCommentService.findAll();
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permission('hard')
  @Get(':id')
  findOne(@Param('id') id: string): Promise<EnrichedFAComments | null> {
    return this.faCommentService.findOne(+id);
  }
}
